import { IsNotEmpty, IsString } from "class-validator";
import { ResponseDto } from "../common.dto";
import Todo from "../../entities/todo.entity";

export class CreateTodoRequest {
  @IsString()
  @IsNotEmpty()
  task!: string;
}

export class CreateTodoResponse extends ResponseDto<
  Pick<Todo, "id" | "task" | "isComplete">
> {}
