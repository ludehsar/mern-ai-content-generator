import { MinLength } from "class-validator";
import LoginDto from "./LoginDto";

export default class RegisterDto extends LoginDto {
  @MinLength(3, { message: "Full Name must be at least 3 chars long" })
  name!: string;
}
