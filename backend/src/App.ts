import "reflect-metadata";
import express from "express";
import logger from "morgan";
import { useExpressServer } from "routing-controllers";
import { CustomErrorHandler } from "./middlewares/CustomErrorHandler";
import config from "./config";
import AuthController from "./server/auth/AuthController";
import passport from "passport";
import { jwtStrategy } from "./strategies/jwt.strategy";
import cors from "cors";

export default class App {
  public app: express.Application;
  public port: number = config.applicationPort;

  constructor() {
    this.app = express();
    this.app.use(logger("dev"));
    this.app.use(cors());

    passport.use(jwtStrategy);

    useExpressServer(this.app, {
      routePrefix: "/api/v1",
      defaultErrorHandler: false,
      classTransformer: true,
      validation: { skipMissingProperties: true },
      controllers: [AuthController],
      middlewares: [CustomErrorHandler],
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
