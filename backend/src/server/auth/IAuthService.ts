import { Result } from "../../models/Result";
import LoginDto from "./models/LoginDto";
import RegisterDto from "./models/RegisterDto";

export interface IAuthService {
  login: (loginDto: LoginDto) => Promise<Result>;
  register: (registerDto: RegisterDto) => Promise<Result>;
  getUser: (userId: string) => Promise<Result>;
}
