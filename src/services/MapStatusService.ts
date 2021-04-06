import { Service, Container } from 'typedi';
import winston from 'winston';
import StatusError from '../dtos/StatusError';
import MapSecureStatus from '../models/MapSecureStatus';
import { IMapStatusModel, IMapStatus } from '../models/MapStatus';
import SteamApi from 'steam-api-ts'
import config from '../config';
import MapValidatorService from './MapValidatorService';

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

    if (query.validated === "true")
      dbQuery.where('mapSecureStatus').in([MapSecureStatus.Safe, MapSecureStatus.Warning, MapSecureStatus.Alert])

    dbQuery
      .limit(20)
      //.explain(true)
      .sort( '-statusChangedDate' );
    
    if (query.page) {
      dbQuery.skip((query.page - 1) * 20)
    }

    return await dbQuery;
  }

  public async getMapStatusBySteamId(steamid): Promise<IMapStatus> {
    const mapStatus = await this.mapStatusModel.findOne({ steamid })

    return mapStatus
  }

  public async createMapStatusRequest(steamid): Promise<IMapStatus> {
    const mapStatusExists = await this.getMapStatusBySteamId(steamid)
    if (mapStatusExists != null)
      throw new StatusError(400, "Map is already requested.")

    const workshopData = await this.steamApi.getPublishedFileDetails(steamid)

    if (workshopData == null || workshopData.consumer_app_id != 311210)
      throw new StatusError(400, "Item is not from Black Ops 3.")
      
    if (workshopData.time_updated * 1000 < new Date(2021, 0, 1).getTime())
      throw new StatusError(400, "This is updated before the exploit being public so should be safe.")

    const creatorData = await this.steamApi.getUserSummary(workshopData.creator)
    

    const mapStatus = await this.mapStatusModel.create({
      name: workshopData.title,
      creatorName: creatorData[0].personaname,
      steamid,
      imageUrl: workshopData.preview_url,
      mapSecureStatus: MapSecureStatus.ValidatorQueue,
      statusChangedDate: Date.now(),
    })

    this.mapValidator.validateMap(mapStatus);

    return mapStatus
  }
}