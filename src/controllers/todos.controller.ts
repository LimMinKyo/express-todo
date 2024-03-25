import {
  Route,
  Tags,
  OperationId,
  Get,
  Security,
  Request,
  Post,
  Body,
  Patch,
  Path,
} from "tsoa";
import express from "express";
import Container from "typedi";
import TodosService from "../services/todos.service";
import { GetTodosResponse } from "../dtos/todos/get-todos.dto";
import {
  CreateTodoRequest,
  CreateTodoResponse,
} from "../dtos/todos/create-todo.dto";
import {
  UpdateTodoRequest,
  UpdateTodoResponse,
} from "../dtos/todos/update-todo.dto";

const JWT_KEY = "jwt";

@Tags("할일API")
@Security(JWT_KEY)
@Route("api/todos")
export default class TodosController {
  private readonly todosService = Container.get(TodosService);

  @Get("/")
  @OperationId("할일 리스트 조회")
  async getTodos(@Request() req: express.Request): Promise<GetTodosResponse> {
    return await this.todosService.getTodos(req.user!);
  }

  @Post("/")
  @OperationId("할일 생성")
  async createTodo(
    @Request() req: express.Request,
    @Body() createTodoRequest: CreateTodoRequest
  ): Promise<CreateTodoResponse> {
    return await this.todosService.createTodo(req.user!, createTodoRequest);
  }

  @Patch("{id}")
  @OperationId("할일 수정")
  async updateTodo(
    @Request() req: express.Request,
    @Path("id") todoId: number,
    @Body()
    updateTodoRequest: UpdateTodoRequest
  ): Promise<UpdateTodoResponse> {
    return await this.todosService.updateTodo(
      req.user!,
      todoId,
      updateTodoRequest
    );
  }
}
