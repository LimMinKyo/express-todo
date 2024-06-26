import { Router } from "express";
import { SignupRequest } from "../../dtos/auth/signup.dto";
import AuthController from "../../controllers/auth.controller";
import { validateBody } from "../../middleware/validate-body.middleware";
import { LoginRequest } from "../../dtos/auth/login.dto";
import Container from "typedi";

const authRouter = Router();

const authController = Container.get(AuthController);

/**
 * 회원가입
 */
authRouter.post("/signup", validateBody(SignupRequest), async (req, res) => {
  const signupRequest: SignupRequest = req.body;
  const response = await authController.signup(signupRequest);
  res.status(201).send(response);
});

/**
 * 로그인
 */
authRouter.post("/login", validateBody(LoginRequest), async (req, res) => {
  const loginRequest: LoginRequest = req.body;
  const response = await authController.login(loginRequest);
  res.send(response);
});

export default authRouter;
