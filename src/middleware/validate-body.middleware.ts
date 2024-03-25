import { NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Request, Response } from "express";

export function validateBody(schema: { new (): any }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const target = plainToClass(schema, req.body);
    try {
      await validateOrReject(target);
      next();
    } catch (error: any) {
      const message = Object.values(error[0].constraints)[0];

      res.status(400).send({ ok: false, message });
    }
  };
}
