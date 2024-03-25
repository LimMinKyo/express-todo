import { Router } from "express";
import authRouter from "./routers/auth.router";
import usersRouter from "./routers/users.router";
import todosRouter from "./routers/todos.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/todos", todosRouter);

export default router;
