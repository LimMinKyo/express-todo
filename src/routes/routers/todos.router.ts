import { Router } from "express";
import { jwtMiddleware } from "../../middleware/jwt.middleware";
import TodosController from "../../controllers/todos.controller";

const todosRouter = Router();

todosRouter.get("/", jwtMiddleware, async (req, res) => {
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

export default todosRouter;
