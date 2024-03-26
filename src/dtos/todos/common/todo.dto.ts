import Todo from "../../../entities/todo.entity";

export type TodoDto = Pick<Todo, "id" | "task" | "isComplete">;
