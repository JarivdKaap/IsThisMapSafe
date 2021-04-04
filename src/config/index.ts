
import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error('🔥 Environment file not found');
}

export default {
  port: parseInt(process.env.PORT!, 10),
  jwtSecret: process.env.JWT_SECRET,
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  databaseURL: process.env.DATABASE_URL,
  api: {
    prefix: '/api',
  },
};