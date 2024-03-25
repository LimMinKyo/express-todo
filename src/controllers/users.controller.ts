import { Route, Tags, OperationId, Get, Security, Request } from "tsoa";
import { GetMyInfoResponse } from "../dtos/users/my.dto";
import express from "express";

const JWT_KEY = "jwt";

@Tags("유저API")
@Route("api/users")
export default class UsersController {
  @Get("/my")
  @OperationId("내정보")
  @Security(JWT_KEY)
  async getMyInfo(@Request() req: express.Request): Promise<GetMyInfoResponse> {
    return {
      ok: true,
      data: req.user,
    };
  }
}
