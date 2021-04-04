import { Router } from 'express';

import auth from './routes/auth';
import mapstatus from './routes/mapStatus';

export default () => {
  const app = Router();

  auth(app);
  mapstatus(app);

  return app;
};
