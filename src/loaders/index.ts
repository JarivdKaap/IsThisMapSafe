import Logger from './logger';

import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('DB loaded and connected!');

  await dependencyInjectorLoader({ mongoConnection });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('ℹ Express loaded');
};