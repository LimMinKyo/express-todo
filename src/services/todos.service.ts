import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";
import Todo from "../entities/todo.entity";
import { GetTodosResponse } from "../dtos/todos/get-todos.dto";
import {
  CreateTodoRequest,
  CreateTodoResponse,
} from "../dtos/todos/create-todo.dto";

@Service()
export default class TodosService {
  private readonly todosRepository = AppDataSource.getRepository(Todo);

  async getTodos(user: User): Promise<GetTodosResponse> {
    const todos = await this.todosRepository.find({
      where: { user: { id: user.id } },
      select: ["id", "task", "isComplete"],
    });

    return {
      ok: true,
      data: todos,
    };
  }

  async createTodo(
    user: User,
    createTodoRequest: CreateTodoRequest
  ): Promise<CreateTodoResponse> {
    await this.todosRepository.save(
      this.todosRepository.create({ user, ...createTodoRequest })
    );

    return { ok: true };
  }
}
