import { Constant, Inject, Service, Value } from "@tsed/di";
import { $log } from "@tsed/logger";
import MapSecureStatus from "src/entities/MapSecureStatus";
import { MapStatus } from "src/entities/MapStatus";
import { MapStatusRepository } from "src/repositories/MapStatusRepository";
import { exec, spawn } from 'child_process'
import crypto from 'crypto'
import rimraf from 'rimraf'
import SteamApi from 'steam-api-ts'
import { SocketIOService } from "./SocketIOService";

@Service()
export class MapValidatorService {
  @Inject()
  private mapStatusRepository: MapStatusRepository;
  @Inject()
  private socketIOService: SocketIOService;

  @Value('validatorExePath')
  private validatorExePath : string;
  @Value('steamCmdInstallFolder')
  private steamCmdInstallFolder : string;
  @Value('deleteItemFiles')
  private deleteItemFiles : string;
  @Value('steamApiKey')
  private steamApiKey: string;
  @Value('httpPort')
  private httpPort : number;
  private steamApi : SteamApi;

  $onInit() {
    this.steamApi = new SteamApi(this.steamApiKey);
  }

  /**
   * Adds a map to the validation queue
   * 
   * @param mapStatus Map status object
   * @returns void
   */
  public async addMapToValidationQueue(mapStatus: MapStatus): Promise<void> {
    // Check if there's already a map being validated
    const addToQueue = (await this.mapStatusRepository.count({ mapSecureStatus: MapSecureStatus.Validating })) > 0;
    // Update the status to validating
    if (addToQueue)
      mapStatus.mapSecureStatus = MapSecureStatus.ValidatorQueue;
    else
      mapStatus.mapSecureStatus = MapSecureStatus.Validating;
    mapStatus.statusMessages = [];
    await this.mapStatusRepository.save(mapStatus);

    // Refresh the queue for all connected clients
    this.socketIOService.refreshQueue();

    // Don't do anything else if it's added to the queue
    if (addToQueue)
      return;

    this.validateMap(mapStatus);
  }

  /**
   * Restarts the validating process
   * 
   * @returns void
   */
  public async restoreAlreadyValidatingMap(): Promise<void> {
    const mapStatus = await this.mapStatusRepository.findOne({ mapSecureStatus: MapSecureStatus.Validating });
    if (!mapStatus)
      return;

    this.validateMap(mapStatus);
  }

  /**
   * Validates a map
   * 
   * @param mapStatus Map status object
   */
  public async validateMap(mapStatus: MapStatus): Promise<void> {
    $log.debug(`Starting download of workshop item ${mapStatus.steamid}`);
    exec(`steamcmd +login anonymous +@nCSClientRateLimitKbps 300000 +workshop_download_item 311210 ${mapStatus.steamid} validate +quit`, async (error, stdout, stderr) => {
      if (error || stderr) {
        $log.error(`Error while downloading workshop item ${mapStatus.steamid}: %o`, (error || stderr))
        // Start the validation again
        this.validateMap(mapStatus)
        return;
      }

      $log.debug(`SteamCMD output:\n${stdout}`);

      // Set the hash
      mapStatus.validationHash = crypto.randomBytes(20).toString('hex');
      await this.mapStatusRepository.save(mapStatus);

      spawn(this.validatorExePath, [this.steamCmdInstallFolder + mapStatus.steamid, mapStatus.validationHash, this.httpPort.toString()])
        .on('exit', async (code) => {
          $log.debug(`Validator exit code: ${code}`);
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
          await this.mapStatusRepository.save(mapStatus);
          // Remove files again
          if (this.deleteItemFiles)
            rimraf(this.steamCmdInstallFolder + mapStatus.steamid, () => {})
          // Refresh the queue for all connected clients
          this.socketIOService.refreshQueue();
          this.socketIOService.mapStatusValidated(mapStatus);
          // Start a new map status validation in the queue
          this.startNewValidation();
        });
    })
  }

  /**
   * Starts a new map status validation in the queue
   *  
   * @returns void
   */
  private async startNewValidation(): Promise<void> {
    const mapStatusQueue = await this.mapStatusRepository.find({ where: { mapSecureStatus: MapSecureStatus.ValidatorQueue }, order: { updatedAt: 'ASC' } });
    if (mapStatusQueue.length == 0)
      return;
    this.addMapToValidationQueue(mapStatusQueue[0])
  }

  /**
   * Checks all validated maps for updates
   * 
   * @returns void
   */
  public async watchForUpdates(): Promise<void> {
    const mapStatuses = await this.mapStatusRepository.find({ where: {mapSecureStatus: [MapSecureStatus.Validating, MapSecureStatus.ValidatorQueue]} })

    for (let i = 0; i < mapStatuses.length; i++) {
      const workshopData = await this.steamApi.getPublishedFileDetails(mapStatuses[i].steamid);
      if (workshopData.time_updated * 1000 > mapStatuses[i].updatedAt.getTime()) {
        $log.debug(`Starting update for item ${mapStatuses[i].steamid}`)
        await this.addMapToValidationQueue(mapStatuses[i])
      }
    }
  }
}