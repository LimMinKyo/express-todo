import { Router } from "express";
import authRouter from "./routers/auth.router";
import usersRouter from "./routers/users.router";
import todosRouter from "./routers/todos.router";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/todos", jwtMiddleware, todosRouter);

export default router;
