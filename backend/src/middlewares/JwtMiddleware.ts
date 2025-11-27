import express from "express";
import passport from "passport";
import {
  ExpressMiddlewareInterface,
  UnauthorizedError,
} from "routing-controllers";

export class JWTMiddleware implements ExpressMiddlewareInterface {
  authenticate = (callback: passport.AuthenticateCallback) =>
    passport.authenticate("jwt", { session: false }, callback);

  use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<passport.Authenticator> {
    return this.authenticate((err, user, info) => {
      if (err || !user) {
        console.log("Unauthorized access");
        console.log(info);
        return next(
          new UnauthorizedError(
            typeof info === "string" ? info : "Unauthorized access"
          )
        );
      }

      req.user = user;
      return next();
    })(req, res, next);
  }
}
