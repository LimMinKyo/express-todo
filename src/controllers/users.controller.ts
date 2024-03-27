import { Route, Tags, OperationId, Get, Security, Request } from "tsoa";
import { GetMyInfoResponse } from "../dtos/users/my.dto";
import express from "express";
import Container, { Service } from "typedi";
import UsersService from "../services/users.service";

const JWT_KEY = "jwt";

@Tags("유저API")
@Route("api/users")
@Service()
export default class UsersController {
  private readonly usersService = Container.get(UsersService);

  @Get("/my")
  @OperationId("내정보")
  @Security(JWT_KEY)
  async getMyInfo(@Request() req: express.Request): Promise<GetMyInfoResponse> {
    return await this.usersService.getMyInfo(req.user!);
  }
}
