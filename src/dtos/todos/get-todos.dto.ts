import Todo from "../../entities/todo.entity";
import { ResponseDto } from "../common.dto";

export class GetTodosResponse extends ResponseDto<Todo[]> {}
