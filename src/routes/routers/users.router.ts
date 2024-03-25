import { Router } from "express";
import UsersController from "../../controllers/users.controller";
import { jwtMiddleware } from "../../middleware/jwt.middleware";

const usersRouter = Router();

usersRouter.get("/my", jwtMiddleware, async (req, res) => {
  try {
    const response = await new UsersController().getMyInfo(req);
    res.send(response);
  } catch (error: any) {
    if (error.message) {
      return res.status(400).send({ ok: false, message: error.message });
    }
    res.status(500).send({ ok: false, message: "INTERNAL_SERVER_ERROR" });
  }
});

export default usersRouter;
