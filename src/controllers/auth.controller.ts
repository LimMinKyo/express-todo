import { Body, Post, Route, Tags, OperationId } from "tsoa";
import Container, { Service } from "typedi";
import AuthService from "../services/auth.service";
import { SignupRequest, SignupResponse } from "../dtos/auth/signup.dto";
import { LoginRequest, LoginResponse } from "../dtos/auth/login.dto";

@Tags("인증API")
@Route("api/auth")
@Service()
export default class AuthController {
  private readonly authService = Container.get(AuthService);

  @Post("/signup")
  @OperationId("회원가입")
  async signup(@Body() signupRequest: SignupRequest): Promise<SignupResponse> {
    return await this.authService.signup(signupRequest);
  }

  @Post("/login")
  @OperationId("로그인")
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(loginRequest);
  }
}
