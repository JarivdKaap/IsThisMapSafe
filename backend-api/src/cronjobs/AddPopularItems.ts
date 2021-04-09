import cron from 'node-cron'
import Container from 'typedi';
import MapStatusService from '../services/MapStatusService';

export default () => {
  cron.schedule('0 0 12 * * 0-6', () => {
    const mapStatusService = Container.get(MapStatusService)
    mapStatusService.addPopularItems()
  });
  const mapStatusService = Container.get(MapStatusService)
  mapStatusService.addPopularItems()
}