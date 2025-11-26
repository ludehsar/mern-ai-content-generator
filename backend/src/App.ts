import "reflect-metadata";
import express from "express";
import logger from "morgan";
import { useExpressServer } from "routing-controllers";
import { CustomErrorHandler } from "./middlewares/CustomErrorHandler";
import config from "./config";

export default class App {
  public app: express.Application;
  public port: number = config.applicationPort;

  constructor() {
    this.app = express();
    this.app.use(logger("dev"));

    useExpressServer(this.app, {
      routePrefix: "/api/v1",
      defaultErrorHandler: false,
      classTransformer: true,
      validation: { skipMissingProperties: true },
      // validation : true,
      // controllers: [UserController],
      middlewares: [CustomErrorHandler],
      // controllerDirs: [__dirname + "/controller/**/*.controller.js"],
      // middlewareDirs: [__dirname + "/middleware/**/*.middleware.js"],
      // interceptorDirs: [__dirname + "/interceptor/**/*.interceptor.js"]
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
