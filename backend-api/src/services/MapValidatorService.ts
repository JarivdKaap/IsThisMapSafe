import { Service, Container } from 'typedi';
import { IMapStatusModel, IMapStatus } from '../models/MapStatus';
import rimraf from 'rimraf'
import crypto from 'crypto'
import { exec, spawn } from 'child_process'
import winston from 'winston';
import MapSecureStatus from '../models/MapSecureStatus';
import config from '../config';
import { Server } from 'socket.io';
import SteamAPI from 'steam-api-ts';

@Service()
export default class MapValidatorService {
  private mapStatusModel: IMapStatusModel;
  private logger: winston.Logger;
  private socketio: Server;
  private steamApi : SteamAPI;

  constructor() {
    this.mapStatusModel = Container.get('mapStatusModel');
    this.logger = Container.get('logger');
    this.socketio = Container.get('socket.io');
    this.steamApi = new SteamAPI(config.steamApiKey);
  }

  public async addMapToValidationQueue(mapStatus: IMapStatus): Promise<void> {
    // Check if there's already a map being validated
    const addToQueue = await this.mapStatusModel.exists({ mapSecureStatus: MapSecureStatus.Validating })
    // Update the status to validating
    if (addToQueue)
      mapStatus.mapSecureStatus = MapSecureStatus.ValidatorQueue;
    else
      mapStatus.mapSecureStatus = MapSecureStatus.Validating;
    mapStatus.statusMessages = [];
    mapStatus.modReviewStatus = null;
    mapStatus.statusChangedDate = new Date();
    await mapStatus.save()

    // Refresh the queue for all connected clients
    this.socketio.emit('refresh-queue');

    // Don't do anything else if it's added to the queue
    if (addToQueue)
      return;

    this.validateMap(mapStatus)
  }

  public async restoreAlreadyValidatingMap(): Promise<void> {
    const mapStatus = await this.mapStatusModel.findOne({ mapSecureStatus: MapSecureStatus.Validating })
    if (!mapStatus)
      return;

    this.validateMap(mapStatus)
  }

  public async validateMap(mapStatus: IMapStatus): Promise<void> {
    this.logger.debug(`Starting download of workshop item ${mapStatus.steamid}`)
    exec(`steamcmd +login anonymous +@nCSClientRateLimitKbps 300000 +workshop_download_item 311210 ${mapStatus.steamid} validate +quit`, async (error, stdout, stderr) => {
      if (error || stderr) {
        this.logger.error(`Error while downloading workshop item ${mapStatus.steamid}: %o`, (error || stderr))
        // Start the validation again
        this.validateMap(mapStatus)
        return;
      }

      this.logger.debug(`SteamCMD output:\n${stdout}`);

      // Set the hash
      mapStatus.validationHash = crypto.randomBytes(20).toString('hex');
      await mapStatus.save()

      spawn(config.validatorExePath, [config.steamCmdInstallFolder + mapStatus.steamid, mapStatus.validationHash, config.port.toString()])
        .on('exit', async (code) => {
          this.logger.debug(`Validator exit code: ${code}`);
          // Update the status
          switch (code) {
            case 1:
              mapStatus.mapSecureStatus = MapSecureStatus.Safe;
              break;
            case 2:
              mapStatus.mapSecureStatus = MapSecureStatus.ManualAction;
              break;
            case 3:
              mapStatus.mapSecureStatus = MapSecureStatus.Warning;
              break;
            case 4:
              mapStatus.mapSecureStatus = MapSecureStatus.Alert;
              break;
            default:
              mapStatus.mapSecureStatus = MapSecureStatus.ManualAction;
              break;
          }
          await mapStatus.save();
          // Remove files again
          if (config.validation.deleteItemFiles)
            rimraf(config.steamCmdInstallFolder + mapStatus.steamid, () => {})
          // Refresh the queue for all connected clients
          this.socketio.emit('refresh-queue');
          this.socketio.emit(`item-validated-${mapStatus.steamid}`, await this.mapStatusModel.findOne({ steamid: mapStatus.steamid })
            .select('-validationHash'));
          // Start a new map status validation in the queue
          this.startNewValidation();
        });
    })
  }

  private async startNewValidation(): Promise<void> {
    const mapStatusQueue = await this.mapStatusModel.find({ mapSecureStatus: MapSecureStatus.ValidatorQueue })
      .sort( 'statusChangedDate' )
    if (mapStatusQueue.length == 0)
      return;
    this.addMapToValidationQueue(mapStatusQueue[0])
  }

  public async watchForUpdates(): Promise<void> {
    const mapStatuses = await this.mapStatusModel.find({ mapSecureStatus: { $nin: [MapSecureStatus.Validating, MapSecureStatus.ValidatorQueue]} })

    for (let i = 0; i < mapStatuses.length; i++) {
      const workshopData = await this.steamApi.getPublishedFileDetails(mapStatuses[i].steamid);
      if (workshopData.time_updated * 1000 > mapStatuses[i].statusChangedDate.getTime()) {
        this.logger.debug(`Starting update for item ${mapStatuses[i].steamid}`)
        await this.addMapToValidationQueue(mapStatuses[i])
      }
    }
  }
}