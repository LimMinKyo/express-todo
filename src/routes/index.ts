import { Router } from "express";
import authRouter from "./routers/auth.router";
import usersRouter from "./routers/users.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", usersRouter);

export default router;
