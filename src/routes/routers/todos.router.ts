import { Router } from "express";
import { jwtMiddleware } from "../../middleware/jwt.middleware";
import TodosController from "../../controllers/todos.controller";
import { CreateTodoRequest } from "../../dtos/todos/create-todo.dto";

const todosRouter = Router();

todosRouter.get("/", async (req, res) => {
  try {
    const response = await new TodosController().getTodos(req);
    res.send(response);
  } catch (error: any) {
    if (error.message) {
      return res.status(400).send({ ok: false, message: error.message });
    }
    res.status(500).send({ ok: false, message: "INTERNAL_SERVER_ERROR" });
  }
});

todosRouter.post("/", async (req, res) => {
  try {
    const createTodoRequest: CreateTodoRequest = req.body;
    const response = await new TodosController().createTodo(
      req,
      createTodoRequest
    );
    res.send(response);
  } catch (error: any) {
    if (error.message) {
      return res.status(400).send({ ok: false, message: error.message });
    }
    res.status(500).send({ ok: false, message: "INTERNAL_SERVER_ERROR" });
  }
});

export default todosRouter;
