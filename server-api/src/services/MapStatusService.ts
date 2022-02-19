import { Err } from "@tsed/common";
import {Constant, Inject, Service, Value} from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import got from "got/dist/source";
import MapSecureStatus from "src/entities/MapSecureStatus";
import {MapStatus} from "src/entities/MapStatus";
import { StatusMessage } from "src/entities/StatusMessage";
import { MapStatusQueue } from "src/models/MapStatus/MapStatusQueue";
import {Pageable} from "src/models/pagination/Pageable";
import {Pagination} from "src/models/pagination/Pagination";
import {MapStatusRepository} from "src/repositories/MapStatusRepository";
import { StatusMessageRepository } from "src/repositories/StatusMessageRepository";
import SteamApi from 'steam-api-ts'
import UserSummary from "steam-api-ts/lib/Structs/UserSummary";
import { ILike, In, Like } from "typeorm";
import { MapValidatorService } from "./MapValidatorService";

@Service()
export class MapStatusService {
  @Inject()
  private mapStatusRepository: MapStatusRepository;
  @Inject()
  private statusMessageRepository: StatusMessageRepository;
  @Inject()
  private mapValidatorService: MapValidatorService;
  @Value('steamApiKey')
  private steamApiKey: string
  private steamApi : SteamApi;

  $onInit() {
    this.steamApi = new SteamApi(this.steamApiKey);
  }

  /**
   * Get map statuses with pagination
   * 
   * @param pageableOptions The pageable options
   * @returns The map statuses
   */
  public async getMapStatuses(pageableOptions: Pageable, validated: boolean = false): Promise<Pagination<MapStatus> | undefined> {
    const size = pageableOptions.size || 10;
    const skip = pageableOptions.offset || 0;

    const [result, total] = await this.mapStatusRepository.findAndCount({
      take: size,
      skip: skip,
      where: !validated ? {} : {
        mapSecureStatus: In([MapSecureStatus.Alert, MapSecureStatus.Warning, MapSecureStatus.Safe])
      }
    });

    return new Pagination({data: result, totalCount: total, pageable: pageableOptions});
  }

  /**
   * get a map status by id
   * 
   * @param id The id of the map status
   * @returns the map status
   */
  public async getMapStatus(id: string): Promise<MapStatus | undefined> {
    return this.mapStatusRepository.findOne({id})
  }

 /**
   * Get map statuses search with pagination
   * 
   * @param pageableOptions The pageable options
   * @param search The search string
   * @returns The map statuses
   */
  public async getMapStatusesSearch(pageableOptions: Pageable, search: string): Promise<Pagination<MapStatus> | undefined> {
    const size = pageableOptions.size || 10;
    const skip = pageableOptions.offset || 0;

    console.log(search)
    const [result, total] = await this.mapStatusRepository.findAndCount({
      take: size,
      skip: skip,
      where: {
        name: ILike(`%${search}%`)
      }
    });

    return new Pagination({data: result, totalCount: total, pageable: pageableOptions});
  }

  /**
   * get a map status by steamid
   * 
   * @param id The steamid of the map status
   * @returns the map status
   */
  public async getMapStatusBySteamId(id: number): Promise<MapStatus | undefined> {
    return this.mapStatusRepository.findOne({ steamid: id })
  }

  /**
   * Get the map status queue
   * 
   * @returns The map status queue
   */
  public async getMapStatusesQueue(): Promise<MapStatusQueue> {
    const beingValidated = await this.mapStatusRepository.findOne({
      mapSecureStatus: MapSecureStatus.Validating
    });

    if (!beingValidated)
      return { validating: null, queue: []}

    const queue = await this.mapStatusRepository.find({ 
      where: { mapSecureStatus: MapSecureStatus.ValidatorQueue },
      order: { createdAt: "ASC" }
    })
        

    return { validating: beingValidated, queue: queue}
  }

  /**
   * Create a new map status and adds it to the queue
   * 
   * @param steamId The steam id of the workshop item
   * @returns The new map status
   */
  public async createMapStatusRequest(steamId: number): Promise<MapStatus> {
    const mapStatusExists = await this.mapStatusRepository.findOne({
      steamid: steamId
    });
    if (mapStatusExists != null)
      throw new BadRequest("Map is already requested.");

    // Fetch workshop data
    const workshopData = await this.steamApi.getPublishedFileDetails(steamId);
    if (workshopData == null || workshopData.consumer_app_id != 311210)
      throw new BadRequest("Item is not from Black Ops 3.");
      
    if (workshopData.time_updated * 1000 < new Date(2021, 0, 1).getTime())
      throw new BadRequest("This is updated before the exploit being public so should be safe.");

    // Fetch creator data for name
    // @ts-ignore - wrong type
    const creatorData = await this.steamApi.getUserSummary(workshopData.creator) as UserSummary[];

    // Add to DB
    const mapStatus = await this.mapStatusRepository.create({
      name: workshopData.title,
      creatorName: creatorData[0].personaname,
      steamid: steamId,
      imageUrl: workshopData.preview_url,
      mapSecureStatus: MapSecureStatus.ValidatorQueue,
      validationHash: null,
    });
    await this.mapStatusRepository.insert(mapStatus);

    // Start the validating process
    this.mapValidatorService.addMapToValidationQueue(mapStatus);

    return mapStatus;
  }

  /**
   * Inserts the status messages for a map status
   * 
   * @param hash The validation hash
   * @param messages The status messages
   */
  public async addStatusMessages(hash: string, messages: StatusMessage[]) {
    if (!hash)
      throw new BadRequest('Hash is required')
    const mapStatus = await this.mapStatusRepository.findOne({ validationHash: hash })
    if (!mapStatus)
      throw new BadRequest('Can\'t find map status with that hash.')

    await messages.forEach(async (message) => {
      message.mapStatus = mapStatus;
      await this.statusMessageRepository.insert(message);
    })
    mapStatus.statusMessages = messages;
    mapStatus.validationHash = null;

    await this.mapStatusRepository.save(mapStatus);
  }

  /**
   * Gets recent maps to add to the database
   * 
   */
  public async addPopularItems(): Promise<void> {
    const httpResponse = await got(`https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=${this.steamApiKey}&query_type=3&page=1&cursor=*&numperpage=15&creator_appid=455130&appid=311210&ids_only=1`);
    const jsonResp = JSON.parse(httpResponse.body);

    if (!jsonResp.response || !jsonResp.response.publishedfiledetails)
      return;

    const items = jsonResp.response.publishedfiledetails;
    for (let i = 0; i < items.length; i++) {
      try {
        await this.createMapStatusRequest(items[i].publishedfileid)
      } catch {}
    }
  }
}
