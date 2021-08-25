import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
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
    lazy: true,
  })
  @JoinColumn({name: 'user_id_fk'})
  user: Promise<User>
}
