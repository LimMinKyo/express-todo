import { Route, Tags, OperationId, Get, Security, Request } from "tsoa";
import express from "express";
import Container from "typedi";
import TodosService from "../services/todos.service";
import { GetTodosResponse } from "../dtos/todos/get-todos.dto";

const JWT_KEY = "jwt";

@Tags("할일API")
@Route("api/todos")
export default class TodosController {
  private readonly todosService = Container.get(TodosService);

  @Get("/")
  @OperationId("리스트 조회")
  @Security(JWT_KEY)
  async getTodos(@Request() req: express.Request): Promise<GetTodosResponse> {
    return this.todosService.getTodos(req.user!);
  }
}
