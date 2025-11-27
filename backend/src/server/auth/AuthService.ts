import { IAuthService } from "./IAuthService";
import { Result } from "../../models/Result";
import { Service } from "typedi";
import ValidationExceptions from "../../constants/RuntimeExceptions";
import User from "../user/models/User";
import RegisterDto from "./models/RegisterDto";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import LoginDto from "./models/LoginDto";
import * as bcrypt from "bcrypt";

@Service()
export class AuthService implements IAuthService {
  login = async (loginDto: LoginDto): Promise<Result> => {
    const user = await User.findOne({ username: loginDto.username });
    if (!user) {
      return Result.failure(ValidationExceptions.USER_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      return Result.failure(ValidationExceptions.INVALID_PASSWORD);
    }
    const token = jwt.sign(
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
    const { _id, hashedPassword, ...userWithoutPassword } = user.toObject();
    return Result.succesful({
      user: {
        _id: _id.toString(),
        ...userWithoutPassword,
      },
      token,
    });
  };

  register = async (registerDto: RegisterDto): Promise<Result> => {
    const existingUser = await User.findOne({ username: registerDto.username });
    if (existingUser) {
      return Result.failure(ValidationExceptions.USER_ALREADY_REGISTERED);
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new User({
      name: registerDto.name,
      username: registerDto.username,
      hashedPassword,
    });
    await user.save();
    const {
      _id,
      hashedPassword: userHashedPassword,
      ...userWithoutPassword
    } = user.toObject();
    return Result.succesful({
      user: {
        _id: _id.toString(),
        ...userWithoutPassword,
      },
    });
  };

  getUser = async (userId: string): Promise<Result> => {
    const user = await User.findById(userId);
    if (!user) {
      throw ValidationExceptions.USER_NOT_FOUND;
    }
    return Result.succesful({ user });
  };
}
