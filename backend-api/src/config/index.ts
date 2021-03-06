
import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  //throw new Error('🔥 Environment file not found');
}

export default {
  port: parseInt(process.env.PORT!, 10),
  jwtSecret: process.env.JWT_SECRET,
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  databaseURL: process.env.DATABASE_URL,
  steamApiKey: process.env.STEAM_API_KEY,
  steamCmdInstallFolder: process.env.STEAMCMD_INSTALL_FOLDER,
  validatorExePath: process.env.VALIDATOR_EXE_PATH,
  validation: {
    deleteItemFiles: process.env.VALIDATION_DELETE_FILES === 'true'
  },
  socketio: {
    clientOrigin: process.env.SOCKETIO_CLIENT_ORIGIN,
  },
};