import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";

@Service()
export default class UsersService {
  private readonly usersRepository = AppDataSource.getRepository(User);

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
