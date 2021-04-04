import { Service, Container } from 'typedi';
import winston from 'winston';
import { IMapStatusModel, IMapStatus } from '../models/MapStatus';

@Service()
export default class MapStatusService {
  private mapStatusModel: IMapStatusModel;
  private logger: winston.Logger;

  constructor() {
    this.mapStatusModel = Container.get('mapStatusModel');
    this.logger = Container.get('logger');
  }

  public async getMapStatuses(query): Promise<IMapStatus[]> {
    let mapstatuses;
    if (query.page) {
      mapstatuses = await this.mapStatusModel.find()
        .skip((query.page - 1) * 20)
        .limit(20)
        .sort( '-statusChangedDate' );
    } else {
      mapstatuses = await this.mapStatusModel.find().limit(20);
    }

    return mapstatuses
  }
}