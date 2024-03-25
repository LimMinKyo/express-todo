import { Router } from "express";
import { SignupRequest } from "../../dtos/auth/signup.dto";
import AuthController from "../../controllers/auth.controller";
import { validateBody } from "../../middleware/validate-body.middleware";
import { LoginRequest } from "../../dtos/auth/login.dto";

const authRouter = Router();

/**
 * 회원가입
 */
authRouter.post("/signup", validateBody(SignupRequest), async (req, res) => {
  try {
    const signupRequest: SignupRequest = req.body;
    const response = await new AuthController().signup(signupRequest);
    res.send(response);
  } catch (error: any) {
    if (error.message) {
      return res.status(400).send({ ok: false, message: error.message });
    }
    res.status(500).send({ ok: false, message: "INTERNAL_SERVER_ERROR" });
  }
});

/**
 * 로그인
 */
authRouter.post("/login", validateBody(LoginRequest), async (req, res) => {
  try {
    const loginRequest: LoginRequest = req.body;
    const response = await new AuthController().login(loginRequest);
    res.send(response);
  } catch (error: any) {
    if (error.message) {
      return res.status(400).send({ ok: false, message: error.message });
    }
    res.status(500).send({ ok: false, message: "INTERNAL_SERVER_ERROR" });
  }
});

export default authRouter;
