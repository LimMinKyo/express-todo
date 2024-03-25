import { Entity, ManyToOne, RelationId, Column } from "typeorm";
import User from "./user.entity";
import { IsString } from "class-validator";
import { CommonEntity } from "./common.entity";

@Entity()
export default class Todo extends CommonEntity {
  @Column()
  @IsString()
  task!: string;

  @Column({ type: "boolean", default: false })
  isComplete!: boolean;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: "CASCADE" })
  user!: User;

  @RelationId((todo: Todo) => todo.user)
  userId!: number;
}
