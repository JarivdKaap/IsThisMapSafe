import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/typeorm";
import {config, rootDir} from "./config";


@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false,
  mount: {
    "/api/": [`${rootDir}/controllers/**/*.ts`],
  },
  swagger: [
    {
      path: "/docs",
      specVersion: "3.0.1"
    }
  ],
  exclude: [
    "**/*.spec.ts"
  ],
  socketIO: {
    path: '/socket-io',
    cors: {
      origin: config.socketio.clientOrigin,
      methods: ["GET", "POST"]
    }
  },
  agenda: {
    enabled: true,
    db: {
      address: config.mongoConnectionString
    }
  },
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
