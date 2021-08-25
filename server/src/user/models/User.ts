import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index, OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm"
import {Post} from "../../post/models/Post";
import {JoinColumn} from "typeorm/browser";

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

  @OneToMany(type => Post, post => post.user, {
    cascade: true,
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({name: 'post_fk'})
  posts: Promise<Post[]>
}
