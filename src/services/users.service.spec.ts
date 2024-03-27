import User from "../entities/user.entity";
import { Repository } from "typeorm";
import UsersService from "./users.service";

describe("UsersService", () => {
  let usersService: UsersService;

  // Mock Repository 생성
  const mockRepository: Partial<Repository<User>> = {
    findOne: jest.fn(),
  };

  // UsersService 인스턴스 생성
  beforeEach(() => {
    usersService = new UsersService(mockRepository as Repository<User>);
  });

  describe("getMyInfo", () => {
    it("should return user information without password", async () => {
      // Arrange
      const user = {
        id: 1,
        email: "test@example.com",
        password: "password",
      };

      // Act
      const result = await usersService.getMyInfo(user as User);

      // Assert
      expect(result.ok).toBe(true);
      expect(result.data.id).toBe(user.id);
      expect(result.data.email).toBe(user.email);
    });
  });

  describe("findById", () => {
    it("should return user if found by id", async () => {
      // Arrange
      const userId = 1;
      const foundUser = {
        id: userId,
        email: "test@example.com",
        password: "password",
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(foundUser);

      // Act
      const result = await usersService.findById(userId);

      // Assert
      expect(result).toEqual(foundUser);
    });

    it("should return null if user not found by id", async () => {
      // Arrange
      const userId = 1;
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act
      const result = await usersService.findById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
