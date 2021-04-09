import express from 'express';
import "reflect-metadata";

import config from './config';
import SocketIoLoader from './loaders/socketio';

import Logger from './loaders/logger';

async function startServer() {
  // Create an instance of the server
  const app = express();

  // Start up all modules
  await require('./loaders').default({ expressApp: app });

  // Start up the servers
  const server = app.listen(config.port, () => {
    Logger.info(`✔  IsThisMapSafe started at port ${config.port}`);
  });
  SocketIoLoader({server});
  await require('./loaders').lateLoaders({ expressApp: app });
}

startServer();