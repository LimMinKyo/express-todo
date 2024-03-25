import { ResponseDto } from "../common.dto";
import { SignupRequest } from "./signup.dto";

export class LoginRequest extends SignupRequest {}

export class LoginResponse extends ResponseDto<{ accessToken: string }> {}
