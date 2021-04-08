
import { Container } from 'typedi';
import Logger from './logger';
import models from './mongoose/models';
import { Db } from 'mongodb';

export default ({ mongoConnection: Db }) => {
  try {
    Container.set('logger', Logger);

    models.forEach(model => {
      Container.set(model.name, model.model);
    });
  } catch (e) {
    Logger.error('Error on Dependency injection loader:');
    Logger.error(e);
  }
};