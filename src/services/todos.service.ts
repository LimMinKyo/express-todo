import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";
import Todo from "../entities/todo.entity";
import { GetTodosResponse } from "../dtos/todos/get-todos.dto";

@Service()
export default class TodosService {
  private readonly todosRepository = AppDataSource.getRepository(Todo);

  async getTodos(user: User): Promise<GetTodosResponse> {
    const todos = await this.todosRepository.find({
      where: { user },
    });

    return {
      ok: true,
      data: todos,
    };
  }
}
