import { Router } from "express";
import UsersController from "../../controllers/users.controller";
import { jwtMiddleware } from "../../middleware/jwt.middleware";
import Container from "typedi";

const usersRouter = Router();

const usersController = Container.get(UsersController);

/**
 * 내 정보 조회
 */
usersRouter.get("/my", jwtMiddleware, async (req, res) => {
  const response = await usersController.getMyInfo(req);
  res.send(response);
});

export default usersRouter;
