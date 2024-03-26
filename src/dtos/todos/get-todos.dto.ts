import { ResponseDto } from "../common.dto";
import { TodoDto } from "./common/todo.dto";

export class GetTodosResponse extends ResponseDto<TodoDto[]> {}
