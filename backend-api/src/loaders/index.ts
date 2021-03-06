import Logger from './logger';

import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';
import cronjobs from '../cronjobs'
import Container from 'typedi';
import MapValidatorService from '../services/MapValidatorService';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('DB loaded and connected!');

  await dependencyInjectorLoader({ mongoConnection });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('ℹ Express loaded');

};

const lateLoaders = async ({ expressApp }) => {
  cronjobs.forEach(cj => cj())
  Logger.info('ℹ Cron jobs loaded');

  const mapValidatorService = Container.get(MapValidatorService);
  await mapValidatorService.restoreAlreadyValidatingMap();
}

export {
  lateLoaders
}