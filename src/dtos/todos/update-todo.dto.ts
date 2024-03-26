import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ResponseDto } from "../common.dto";
import { TodoDto } from "./common/todo.dto";

export class UpdateTodoRequest {
  @IsString()
  @IsNotEmpty()
  task!: string;

  @IsBoolean()
  isComplete!: boolean;
}

export class UpdateTodoResponse extends ResponseDto<TodoDto> {}
