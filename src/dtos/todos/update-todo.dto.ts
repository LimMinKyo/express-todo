import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ResponseDto } from "../common.dto";
import Todo from "../../entities/todo.entity";

export class UpdateTodoRequest {
  @IsString()
  @IsNotEmpty()
  task!: string;

  @IsBoolean()
  isComplete!: boolean;
}

export class UpdateTodoResponse extends ResponseDto<
  Pick<Todo, "id" | "task" | "isComplete">
> {}
