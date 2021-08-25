import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm"

@Entity({name: "player"})
@Unique(["email"])
@Unique(["username"])
@Unique(['id'])

export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: "email"})
  email: string

  @Column()
  password: string

  @Index('username_idx')
  @Column({name: "username"})
  username: string

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string
}
