import { IAuthService } from "./IAuthService";
import { Result } from "../../models/Result";
import { Service } from "typedi";
import ValidationExceptions from "../../constants/RuntimeExceptions";
import User, { IUser } from "../user/models/User";
import RegisterDto from "./models/RegisterDto";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import LoginDto from "./models/LoginDto";
import * as bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "routing-controllers";

@Service()
export class AuthService implements IAuthService {
  login = async (loginDto: LoginDto): Promise<Result> => {
    const user = await User.findOne({ username: loginDto.username });
    if (!user) {
      throw new NotFoundError(ValidationExceptions.USER_NOT_FOUND.message);
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      throw new BadRequestError(ValidationExceptions.INVALID_PASSWORD.message);
    }
    const { hashedPassword, ...userWithoutPassword } = user.toObject();
    return Result.succesful({
      user: {
        ...userWithoutPassword,
      },
      token: this.generateToken(user),
    });
  };

  register = async (registerDto: RegisterDto): Promise<Result> => {
    const existingUser = await User.findOne({ username: registerDto.username });
    if (existingUser) {
      throw new BadRequestError(
        ValidationExceptions.USER_ALREADY_REGISTERED.message
      );
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new User({
      name: registerDto.name,
      username: registerDto.username,
      hashedPassword,
    });
    await user.save();
    const { hashedPassword: userHashedPassword, ...userWithoutPassword } =
      user.toObject();
    return Result.succesful({
      user: {
        ...userWithoutPassword,
      },
      token: this.generateToken(user),
    });
  };

  getUser = async (userId: string): Promise<Result> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(ValidationExceptions.USER_NOT_FOUND.message);
    }
    return Result.succesful({ user });
  };

  private generateToken = (user: IUser): string => {
    return jwt.sign(
      {
        userDto: {
          userId: user._id.toString(),
          username: user.username,
          name: user.name,
        },
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
  };
}
