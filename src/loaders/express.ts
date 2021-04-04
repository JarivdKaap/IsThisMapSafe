import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import routes from '../api';
import config from '../config';
import { CelebrateError } from 'celebrate';

export default ({ app }: { app: express.Application }) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');

  app.use(cors());

  app.use(helmet());

  app.use(require('method-override')());

  app.use(bodyParser.json());

  app.use(config.api.prefix, routes());

  app.use(express.static('client-dist'))


  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });
  app.use((err, req, res, next) => {
    /**
     * Handle errors thrown by Celebrate
     */
    if (err instanceof CelebrateError) {
      return res
        .status(400)
        .json({
          errors: err.details.get('body').details.map(d => d.message)
        });
    }
    return next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};