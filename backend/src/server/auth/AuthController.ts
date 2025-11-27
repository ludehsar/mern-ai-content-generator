import {
  JsonController,
  Body,
  Post,
  Req,
  Get,
  UseBefore,
} from "routing-controllers";
import { IAuthService } from "./IAuthService";
import { Request } from "express";
import { SuccessResponse } from "../../models/SuccessResponse";
import LoginDto from "./models/LoginDto";
import { Container } from "typedi";
import { AuthService } from "./AuthService";
import { JWTMiddleware } from "../../middlewares/JwtMiddleware";
import RegisterDto from "./models/RegisterDto";
import { IUser } from "../user/models/User";

@JsonController("/auth")
export default class AuthController {
  public authService: IAuthService = Container.get(AuthService);

  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return new SuccessResponse(result.getValue());
  }

  @Post("/register")
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return new SuccessResponse(result.getValue());
  }

  @Get("/me")
  @UseBefore(JWTMiddleware)
  async me(@Req() request: Request) {
    const { _id, hashedPassword, ...userWithoutPassword } = (
      request.user as IUser
    ).toObject();
    return new SuccessResponse({
      user: {
        _id: _id.toString(),
        ...userWithoutPassword,
      },
    });
  }
}
