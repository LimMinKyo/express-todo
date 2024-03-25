import User from "../../entities/user.entity";
import { ResponseDto } from "../common.dto";

export class GetMyInfoResponse extends ResponseDto<
  Omit<User, "todos" | "password">
> {}
