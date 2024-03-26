import { Router } from "express";
import UsersController from "../../controllers/users.controller";
import { jwtMiddleware } from "../../middleware/jwt.middleware";

const usersRouter = Router();

/**
 * 내 정보 조회
 */
usersRouter.get("/my", jwtMiddleware, async (req, res) => {
  const response = await new UsersController().getMyInfo(req);
  res.send(response);
});

export default usersRouter;
