import { Router } from "express";
import TodosController from "../../controllers/todos.controller";
import { CreateTodoRequest } from "../../dtos/todos/create-todo.dto";
import { UpdateTodoRequest } from "../../dtos/todos/update-todo.dto";
import { validateBody } from "../../middleware/validate-body.middleware";
import Container from "typedi";

const todosRouter = Router();

const todosController = Container.get(TodosController);

/**
 * 할일 리스트 조회
 */
todosRouter.get("/", async (req, res) => {
  const response = await todosController.getTodos(req);
  res.send(response);
});

/**
 * 할일 생성
 */
todosRouter.post("/", validateBody(CreateTodoRequest), async (req, res) => {
  const createTodoRequest: CreateTodoRequest = req.body;
  const response = await todosController.createTodo(req, createTodoRequest);
  res.status(201).send(response);
});

/**
 * 할일 수정
 */
todosRouter.patch("/:id", validateBody(UpdateTodoRequest), async (req, res) => {
  const updateTodoRequest: UpdateTodoRequest = req.body;
  const todoId = +req.params.id;
  const response = await todosController.updateTodo(
    req,
    todoId,
    updateTodoRequest
  );
  res.send(response);
});

/**
 * 할일 삭제
 */
todosRouter.delete("/:id", async (req, res) => {
  const todoId = +req.params.id;
  const response = await todosController.deleteTodo(req, todoId);
  res.send(response);
});

export default todosRouter;
