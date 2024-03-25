import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { SignupRequest, SignupResponse } from "../dtos/auth/signup.dto";
import User from "../entities/user.entity";
import { LoginRequest, LoginResponse } from "../dtos/auth/login.dto";
import { hashUtils } from "../utils/hash";
import { jwtUtils } from "../utils/jwt";

@Service()
export default class AuthService {
  private readonly usersRepository = AppDataSource.getRepository(User);

  async signup(signupRequest: SignupRequest): Promise<SignupResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: signupRequest.email },
    });

    if (user) {
      throw new Error("해당 이메일은 이미 사용중 입니다.");
    }

    await this.usersRepository.save(
      this.usersRepository.create({
        ...signupRequest,
        password: await hashUtils.hash(signupRequest.password),
      })
    );

    return { ok: true };
  }

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ["password", "id"],
    });

    if (!user) {
      throw new Error("이메일 또는 패스워드가 일치하지 않습니다.");
    }

    const isPasswordCorrect = await hashUtils.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("이메일 또는 패스워드가 일치하지 않습니다.");
    }

    const accessToken = jwtUtils.sign(user.id);

    return { ok: true, data: { accessToken } };
  }
}
