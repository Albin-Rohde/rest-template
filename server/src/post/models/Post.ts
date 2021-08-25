import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn, Entity,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string
}
