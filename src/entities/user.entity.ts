import { Column, Entity, OneToMany } from "typeorm";
import Todo from "./todo.entity";
import { IsEmail, IsString } from "class-validator";
import { CommonEntity } from "./common.entity";

@Entity()
export default class User extends CommonEntity {
  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @IsString()
  password!: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];
}
