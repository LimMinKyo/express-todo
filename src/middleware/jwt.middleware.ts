import { Request, Response, NextFunction } from "express";
import { jwtUtils } from "../utils/jwt";
import Container from "typedi";
import UsersService from "../services/users.service";

const usersService = Container.get(UsersService);

export async function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["token"]) {
    res.status(401).send({ ok: false, message: "Authorization Error" });
    return;
  }

  const token = req.headers["token"];

  try {
    if (token) {
      const decoded = jwtUtils.verify(token.toString());

      if (typeof decoded === "object" && decoded.id) {
        const user = await usersService.findById(decoded.id);

        if (!user) {
          res.status(401).send({ ok: false, message: "Authorization Error" });
        } else {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    res.status(401).send({ ok: false, message: "Authorization Error" });
  }
}
