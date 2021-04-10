import cron from 'node-cron'
import Container from 'typedi';
import LoggerInstance from '../loaders/logger';
import MapStatusService from '../services/MapStatusService';

export default () => {
  cron.schedule('0 0 12 * * 0-6', () => {
    LoggerInstance.info('Starting search for new trending items')
    const mapStatusService = Container.get(MapStatusService)
    mapStatusService.addPopularItems()
  });
}