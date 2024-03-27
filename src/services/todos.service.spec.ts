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
import { Repository } from "typeorm";
import TodosService from "./todos.service";
import Todo from "../entities/todo.entity";
import User from "../entities/user.entity";
import { TodoDto } from "../dtos/todos/common/todo.dto";

const testUser: User = {
  id: 1,
  email: "test@example.com",
  password: "password",
  todos: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TodosService", () => {
  let todosService: TodosService;

  // Mock Repository 생성
  const mockRepository: Partial<Repository<Todo>> = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  // TodosService 인스턴스 생성
  beforeEach(() => {
    todosService = new TodosService(mockRepository as Repository<Todo>);
  });

  describe("getTodos", () => {
    it("should return todos for a given user", async () => {
      // Arrange
      const user = testUser;
      const todos = [{ id: 1, task: "Task 1", isComplete: false }];

      mockRepository.find = jest.fn().mockResolvedValue(todos);

      // Act
      const getTodosResponse: GetTodosResponse = await todosService.getTodos(
        user
      );

      // Assert
      expect(getTodosResponse.ok).toBe(true);
      expect(getTodosResponse.data).toEqual(todos);
    });
  });

  describe("createTodo", () => {
    it("should create a new todo for a given user", async () => {
      // Arrange
      const user = testUser;
      const createTodoRequest: CreateTodoRequest = {
        task: "New Task",
      };

      const createdTodo = { id: 1, ...createTodoRequest };

      mockRepository.save = jest.fn().mockResolvedValue(createdTodo);

      // Act
      const createTodoResponse: CreateTodoResponse =
        await todosService.createTodo(user, createTodoRequest);

      // Assert
      expect(createTodoResponse.ok).toBe(true);
      expect(createTodoResponse.data).toEqual(createdTodo);
    });
  });

  describe("updateTodo", () => {
    it("should update todo successfully", async () => {
      // Arrange
      const user = testUser; // Mocked user
      const todoId = 1;
      const updateTodoRequest: UpdateTodoRequest = {
        task: "New Task",
        isComplete: true,
      };

      const existingTodo = {
        id: todoId,
        task: "Old Task",
        isComplete: false,
        userId: testUser.id,
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(existingTodo);
      mockRepository.save = jest.fn().mockResolvedValue(null);

      // Act
      const updateTodoResponse: UpdateTodoResponse =
        await todosService.updateTodo(user, todoId, updateTodoRequest);

      // Assert
      expect(updateTodoResponse).toEqual({
        ok: true,
        data: { id: todoId, ...updateTodoRequest },
      });
    });

    it("should return error if todo not found", async () => {
      // Arrange
      const user = testUser; // Mocked user
      const todoId = 1;
      const updateTodoRequest: UpdateTodoRequest = {
        task: "New Task",
        isComplete: true,
      };

      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      const response = await todosService.updateTodo(
        user,
        todoId,
        updateTodoRequest
      );

      expect(response).toEqual({
        ok: false,
        message: "해당 id의 할일이 없습니다.",
      });
    });

    it("should return error if user does not have permission to update todo", async () => {
      // Arrange
      const user = testUser; // Mocked user
      const todoId = 1;
      const updateTodoRequest: UpdateTodoRequest = {
        task: "New Task",
        isComplete: true,
      };

      const existingTodo: TodoDto = {
        id: todoId,
        task: "Old Task",
        isComplete: false,
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(existingTodo);

      // Act & Assert
      const response = await todosService.updateTodo(
        user,
        todoId,
        updateTodoRequest
      );

      expect(response).toEqual({
        ok: false,
        message: "해당 할일을 수정할 권한이 없습니다.",
      });
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo successfully", async () => {
      // Arrange
      const user = testUser; // Mocked user
      const todoId = 1;
      const existingTodo = {
        id: todoId,
        task: "Old Task",
        isComplete: false,
        userId: testUser.id,
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(existingTodo);

      // Act
      const deleteTodoResponse: DeleteTodoResponse =
        await todosService.deleteTodo(user, todoId);

      // Assert
      expect(deleteTodoResponse.ok).toBe(true);
    });

    it("should return error if todo not found", async () => {
      // Arrange
      const user = testUser; // Mocked user
      const todoId = 1;

      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      const response = await todosService.deleteTodo(user, todoId);

      // Act & Assert
      expect(response).toEqual({
        ok: false,
        message: "해당 id의 할일이 없습니다.",
      });
    });

    it("should return error if user does not have permission to delete todo", async () => {
      // Arrange
      const user: User = testUser; // Mocked user
      const todoId = 1;
      const existingTodo: TodoDto = {
        id: todoId,
        task: "Old Task",
        isComplete: false,
      };
      mockRepository.findOne = jest.fn().mockResolvedValue(existingTodo);

      const response = await todosService.deleteTodo(user, todoId);

      // Act & Assert
      expect(response).toEqual({
        ok: false,
        message: "해당 할일을 수정할 권한이 없습니다.",
      });
    });
  });
});
