import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../server/user/models/User";
import config from "../config";

interface IJwtTokenPayload {
  userDto: {
    name: string;
    username: string;
    userId: string;
  };
  iat: number;
  exp: number;
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export const jwtStrategy = new JwtStrategy(opts, async function (
  jwtPayload: IJwtTokenPayload,
  done
) {
  try {
    const user = await User.findById(jwtPayload.userDto.userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});
