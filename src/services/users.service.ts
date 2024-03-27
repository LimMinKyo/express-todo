import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";
import { Repository } from "typeorm";

@Service()
export default class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(repository = AppDataSource.getRepository(User)) {
    this.usersRepository = repository;
  }

  async getMyInfo(user: User) {
    const { password, ...rest } = user;

    return {
      ok: true,
      data: rest,
    };
  }

  async findById(userId: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    return user;
  }
}
