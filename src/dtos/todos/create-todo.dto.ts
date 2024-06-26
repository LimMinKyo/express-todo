import { IsNotEmpty, IsString } from "class-validator";
import { ResponseDto } from "../common.dto";
import { TodoDto } from "./common/todo.dto";

export class CreateTodoRequest {
  @IsString()
  @IsNotEmpty()
  task!: string;
}

export class CreateTodoResponse extends ResponseDto<TodoDto> {}
