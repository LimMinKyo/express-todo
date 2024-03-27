import { SignupRequest, SignupResponse } from "../dtos/auth/signup.dto";
import { LoginRequest, LoginResponse } from "../dtos/auth/login.dto";
import { hashUtils } from "../utils/hash";
import { jwtUtils } from "../utils/jwt";
import { Repository } from "typeorm";
import User from "../entities/user.entity";
import AuthService from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;

  // Mock Repository 생성
  const mockRepository: Partial<Repository<User>> = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  // AuthService 인스턴스 생성
  beforeEach(() => {
    authService = new AuthService(mockRepository as Repository<User>);
  });

  describe("signup", () => {
    it("should sign up a new user", async () => {
      // Arrange
      const signupRequest: SignupRequest = {
        email: "test@example.com",
        password: "password",
      };

      const hashedPassword = "hashedPassword";
      hashUtils.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      const signupResponse: SignupResponse = await authService.signup(
        signupRequest
      );

      // Assert
      expect(signupResponse.ok).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: signupRequest.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: signupRequest.email,
        password: hashedPassword,
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it("should throw an error if the email is already in use", async () => {
      // Arrange
      const signupRequest: SignupRequest = {
        email: "test@example.com",
        password: "password",
      };

      mockRepository.findOne = jest
        .fn()
        .mockResolvedValue({ email: "test@example.com" });

      // Act & Assert
      await expect(authService.signup(signupRequest)).rejects.toThrow(
        "해당 이메일은 이미 사용중 입니다."
      );
    });
  });

  describe("login", () => {
    it("should log in with correct email and password", async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "password",
      };

      const user = {
        id: 1,
        password: "hashedPassword",
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(user);
      hashUtils.compare = jest.fn().mockResolvedValue(true);
      jwtUtils.sign = jest.fn().mockReturnValue("accessToken");

      // Act
      const loginResponse: LoginResponse = await authService.login(
        loginRequest
      );

      // Assert
      expect(loginResponse.ok).toBe(true);
      expect(loginResponse.data?.accessToken).toBeDefined();
    });

    it("should throw an error with incorrect email or password", async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "password",
      };

      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginRequest)).rejects.toThrow(
        "이메일 또는 패스워드가 일치하지 않습니다."
      );
    });

    it("should throw an error with incorrect password", async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "password",
      };

      const user = {
        id: 1,
        password: "hashedPassword",
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(user);
      hashUtils.compare = jest.fn().mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginRequest)).rejects.toThrow(
        "이메일 또는 패스워드가 일치하지 않습니다."
      );
    });
  });
});
