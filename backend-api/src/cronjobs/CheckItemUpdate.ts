import cron from 'node-cron'
import Container from 'typedi';
import LoggerInstance from '../loaders/logger';
import MapValidatorService from '../services/MapValidatorService';

export default () => {
  cron.schedule('0 0 */1 * * *', () => {
    LoggerInstance.info('Starting mapstatus updates')
    const mapValidatorService = Container.get(MapValidatorService)
    mapValidatorService.watchForUpdates()
  });
  const mapValidatorService = Container.get(MapValidatorService)
  mapValidatorService.watchForUpdates()
}