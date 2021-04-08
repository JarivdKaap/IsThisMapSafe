import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import logger from '../../loaders/logger';
import MapStatusService from '../../services/MapStatusService';
import MessageStatus from '../../models/MessageStatus';

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
        return res.status(200).json(mapstatuses);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  )

  route.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling get mapstatus with id: %d', req.params.id);
      try {
        const mapStatusServiceInstance = Container.get(MapStatusService);
        const mapstatus = await mapStatusServiceInstance.getMapStatusBySteamId(req.params.id);
        return res.status(200).json(mapstatus);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  )

  route.post(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling request mapstatus with id: %d', req.params.id);
      try {
        const mapStatusServiceInstance = Container.get(MapStatusService);
        const mapstatus = await mapStatusServiceInstance.createMapStatusRequest(req.params.id);
        return res.status(201).json(mapstatus);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  )

  route.post(
    '/messages/:hash',
    celebrate({
      body: Joi.object({
        messages: Joi.array().items(Joi.object({
          message: Joi.string().required(),
          messsageStatus: Joi.number().required(),
        }))
          .default([]),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling add messages with hash: %s', req.params.hash);
      try {
        const mapStatusServiceInstance = Container.get(MapStatusService);
        await mapStatusServiceInstance.addStatusMessages(req.params.hash, req.body.messages);
        return res.status(201).json({ success: true });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  )
}