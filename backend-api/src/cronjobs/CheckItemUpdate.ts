import cron from 'node-cron'
import Container from 'typedi';
import MapValidatorService from '../services/MapValidatorService';

export default () => {
  cron.schedule('0 0 */6 * * *', () => {
    const mapValidatorService = Container.get(MapValidatorService)
    mapValidatorService.watchForUpdates()
  });
}