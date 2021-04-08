import { Service, Container } from 'typedi';
import { IMapStatusModel, IMapStatus } from '../models/MapStatus';
import rimraf from 'rimraf'
import crypto from 'crypto'
import { exec, spawn } from 'child_process'
import winston from 'winston';
import MapSecureStatus from '../models/MapSecureStatus';
import config from '../config';

@Service()
export default class MapValidatorService {
  private mapStatusModel: IMapStatusModel;
  private logger: winston.Logger;

  constructor() {
    this.mapStatusModel = Container.get('mapStatusModel');
    this.logger = Container.get('logger');
  }

  public async validateMap(mapStatus: IMapStatus): Promise<void> {
    // Check if there's already a map being validated
    const addToQueue = await this.mapStatusModel.exists({ mapSecureStatus: MapSecureStatus.Validating })
    // Update the status to validating
    if (addToQueue)
      mapStatus.mapSecureStatus = MapSecureStatus.ValidatorQueue;
    else
      mapStatus.mapSecureStatus = MapSecureStatus.Validating;
    mapStatus.statusMessages = [];
    mapStatus.statusChangedDate = new Date();
    await mapStatus.save()

    // Don't do anything else if it's added to the queue
    if (addToQueue)
      return;
    
    this.logger.debug(`Starting download of workshop item ${mapStatus.steamid}`)
    exec(`steamcmd +login anonymous +@nCSClientRateLimitKbps 300000 +workshop_download_item 311210 ${mapStatus.steamid} validate +quit`, async (error, stdout, stderr) => {
      if (error || stderr) {
        this.logger.debug(`Error while downloading workshop item ${mapStatus.steamid}: %o`, (error || stderr))
        // Remove files again
        rimraf(config.steamCmdInstallFolder + mapStatus.steamid, () => {})
        // Set the status back to queue
        mapStatus.mapSecureStatus = MapSecureStatus.ValidatorQueue;
        await mapStatus.save();
        // Start a new map status validation in the queue
        this.startNewValidation()
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
          rimraf(config.steamCmdInstallFolder + mapStatus.steamid, () => {})
          // Start a new map status validation in the queue
          this.startNewValidation();
        });
    })
  }

  private async startNewValidation(): Promise<void> {
    const mapStatusQueue = await this.mapStatusModel.find({ mapSecureStatus: MapSecureStatus.ValidatorQueue })
    if (mapStatusQueue.length == 0)
      return;
    this.validateMap(mapStatusQueue[0])
  }
}