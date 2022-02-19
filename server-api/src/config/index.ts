import {join} from "path";
import {loggerConfig} from "./logger";
import typeormConfig from "./typeorm";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");


const envFilePath =
  process.env.NODE_ENV === "production"
    ? "./prod.env"
    : process.env.NODE_ENV === "test"
    ? "./test.env"
    : "./dev.env";
const configEnv = require("dotenv").config({ path: envFilePath });
console.log(configEnv.parsed.STEAM_API_KEY)

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  typeorm: typeormConfig,
  // additional shared configuration
  steamApiKey: configEnv.parsed.STEAM_API_KEY,
  socketio: {
    clientOrigin: configEnv.parsed.SOCKET_IO_CLIENT_ORIGIN
  },
  mongoConnectionString: configEnv.parsed.MONGO_AGENDA_URL,
  validatorExePath: configEnv.parsed.VALIDATOR_EXE_PATH,
  validatorExeArgs: configEnv.parsed.VALIDATOR_EXE_ARGS,
  validatorExeTimeout: configEnv.parsed.VALIDATOR_EXE_TIMEOUT,
};
