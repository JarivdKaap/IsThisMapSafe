import { Service, Container } from 'typedi';
import winston from 'winston';
import StatusError from '../dtos/StatusError';
import MapSecureStatus from '../models/MapSecureStatus';
import { IMapStatusModel, IMapStatus } from '../models/MapStatus';
import SteamApi from 'steam-api-ts'
import config from '../config';
import MapValidatorService from './MapValidatorService';
import MessageStatus from '../models/MessageStatus';
import axios from 'axios';

@Service()
export default class MapStatusService {
  private mapStatusModel: IMapStatusModel;
  private logger: winston.Logger;
  private steamApi : SteamApi;
  
  constructor(
    private mapValidator: MapValidatorService
  ) {
    this.mapStatusModel = Container.get('mapStatusModel');
    this.logger = Container.get('logger');
    this.steamApi = new SteamApi(config.steamApiKey);
  }

  public async getMapStatuses(query): Promise<IMapStatus[]> {
    let dbQuery;
    if (query.search) {
      dbQuery = this.mapStatusModel.find({ $or : [{ name: { $regex: query.search, $options: "i" } }, { creatorName: { $regex: query.search, $options: "i" } }]})
    } else {
      dbQuery = this.mapStatusModel.find()
    }

    // Check if we only want the already validated map statuses
    if (query.validated === "true")
      dbQuery.where('mapSecureStatus').in([MapSecureStatus.Safe, MapSecureStatus.Warning, MapSecureStatus.Alert])

    if (query.page) {
      dbQuery.skip((query.page - 1) * 10)
    }
    dbQuery
      .select('-validationHash')
      .sort( '-statusChangedDate' )
      .limit(10);

    return await dbQuery;
  }

  public async getMapStatusBySteamId(steamid): Promise<IMapStatus> {
    return await this.mapStatusModel.findOne({ steamid })
      .select('-validationHash')
  }

  public async getMapsQueue() {
    const beingValidated = await this.mapStatusModel.findOne({ mapSecureStatus: MapSecureStatus.Validating })
      .select('-validationHash')
    if (!beingValidated)
      return { validating: null, queue: []}
    
    const queue = await this.mapStatusModel.find({ mapSecureStatus: MapSecureStatus.ValidatorQueue })
      .sort( 'statusChangedDate' )
      .select('-validationHash')

    return { validating: beingValidated, queue: queue}
  }

  public async createMapStatusRequest(steamid): Promise<IMapStatus> {
    const mapStatusExists = await this.getMapStatusBySteamId(steamid)
    if (mapStatusExists != null)
      throw new StatusError(400, "Map is already requested.")

    // Fetch workshop data
    const workshopData = await this.steamApi.getPublishedFileDetails(steamid)
    if (workshopData == null || workshopData.consumer_app_id != 311210)
      throw new StatusError(400, "Item is not from Black Ops 3.")
      
    if (workshopData.time_updated * 1000 < new Date(2021, 0, 1).getTime())
      throw new StatusError(400, "This is updated before the exploit being public so should be safe.")

    // Fetch creator data for name
    const creatorData = await this.steamApi.getUserSummary(workshopData.creator)
    
    // Add to DB
    const mapStatus = await this.mapStatusModel.create({
      name: workshopData.title,
      creatorName: creatorData[0].personaname,
      steamid,
      imageUrl: workshopData.preview_url,
      mapSecureStatus: MapSecureStatus.ValidatorQueue,
      statusChangedDate: Date.now(),
      validationHash: null,
    })

    // Start the validating process
    this.mapValidator.addMapToValidationQueue(mapStatus);

    return mapStatus
  }

  public async addStatusMessages(hash: string, messages: { message: string, messsageStatus: MessageStatus}[]): Promise<void> {
    if (!hash)
      throw new StatusError(400, 'Hash is required')
    const mapStatus = await this.mapStatusModel.findOne({ validationHash: hash })
    if (!mapStatus)
      throw new StatusError(400, 'Can\'t find map status with that hash.')

    messages.forEach(message => {
      mapStatus.statusMessages.push({ status: message.messsageStatus, message: message.message})
    });
    mapStatus.validationHash = null;
    await mapStatus.save();
  }

  public async addPopularItems(): Promise<void> {
    const stuff = await axios.get(`https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=${config.steamApiKey}&query_type=3&page=1&cursor=*&numperpage=15&creator_appid=455130&appid=311210&ids_only=1`);

    if (!stuff.data.response || !stuff.data.response.publishedfiledetails)
      return;

    const items = stuff.data.response.publishedfiledetails;
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      try {
        await this.createMapStatusRequest(items[i].publishedfileid)
      } catch {}
    }
  }
}