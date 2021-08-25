import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import {User} from "../../user/models/User";

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

  @ManyToOne(type => User, user => user.posts, {
    cascade: true,
    lazy: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User
}
