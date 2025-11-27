import { MinLength } from "class-validator";

export default class LoginDto {
  @MinLength(3, { message: "Username must be at least 3 chars long" })
  username!: string;

  @MinLength(8, { message: "Password must be at least 8 chars long" })
  password!: string;
}
