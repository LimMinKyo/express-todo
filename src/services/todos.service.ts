import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";
import Todo from "../entities/todo.entity";
import { GetTodosResponse } from "../dtos/todos/get-todos.dto";
import {
  CreateTodoRequest,
  CreateTodoResponse,
} from "../dtos/todos/create-todo.dto";
import {
  UpdateTodoRequest,
  UpdateTodoResponse,
} from "../dtos/todos/update-todo.dto";
import { DeleteTodoResponse } from "../dtos/todos/delete-todo.dto";

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
    const { id, task, isComplete } = await this.todosRepository.save(
      this.todosRepository.create({ user, ...createTodoRequest })
    );

    return { ok: true, data: { id, task, isComplete } };
  }

  async updateTodo(
    user: User,
    todoId: number,
    updateTodoRequest: UpdateTodoRequest
  ): Promise<UpdateTodoResponse> {
    let todo = await this.todosRepository.findOne({
      where: { id: todoId },
    });

    if (!todo) {
      return { ok: false, message: "해당 id의 할일이 없습니다." };
    }

    if (todo.userId !== user.id) {
      return { ok: false, message: "해당 할일을 수정할 권한이 없습니다." };
    }

    todo = { ...todo, ...updateTodoRequest };

    await this.todosRepository.save([todo]);

    const { id, task, isComplete } = todo;

    return { ok: true, data: { id, task, isComplete } };
  }

  async deleteTodo(user: User, todoId: number): Promise<DeleteTodoResponse> {
    const todo = await this.todosRepository.findOne({ where: { id: todoId } });

    if (!todo) {
      return { ok: false, message: "해당 id의 할일이 없습니다." };
    }

    if (todo.userId !== user.id) {
      return { ok: false, message: "해당 할일을 수정할 권한이 없습니다." };
    }

    await this.todosRepository.delete(todoId);

    return { ok: true };
  }
}
