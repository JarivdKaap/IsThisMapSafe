import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import logger from '../../loaders/logger';
import MapStatusService from '../../services/mapstatus';

const route = Router();

export default (app: Router) => {
  app.use("/mapstatus", route);

  route.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling get mapstatuses with query: %o', req.query);
      try {
        const mapStatusServiceInstance = Container.get(MapStatusService);
        const mapstatuses = await mapStatusServiceInstance.getMapStatuses(req.query);
        return res.status(201).json(mapstatuses);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  )
}