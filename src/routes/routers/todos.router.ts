import { Router } from "express";
import TodosController from "../../controllers/todos.controller";
import { CreateTodoRequest } from "../../dtos/todos/create-todo.dto";
import { UpdateTodoRequest } from "../../dtos/todos/update-todo.dto";

const todosRouter = Router();

/**
 * 할일 리스트 조회
 */
todosRouter.get("/", async (req, res) => {
  const response = await new TodosController().getTodos(req);
  res.send(response);
});

/**
 * 할일 생성
 */
todosRouter.post("/", async (req, res) => {
  const createTodoRequest: CreateTodoRequest = req.body;
  const response = await new TodosController().createTodo(
    req,
    createTodoRequest
  );
  res.send(response);
});

/**
 * 할일 수정
 */
todosRouter.patch("/:id", async (req, res) => {
  const updateTodoRequest: UpdateTodoRequest = req.body;
  const todoId = +req.params.id;
  const response = await new TodosController().updateTodo(
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
  const response = await new TodosController().deleteTodo(req, todoId);
  res.send(response);
});

export default todosRouter;
