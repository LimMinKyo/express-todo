import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ResponseDto } from "../common.dto";

export class SignupRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class SignupResponse extends ResponseDto {}
