import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { PostHashtag } from "./postHashtag";


@Entity("posts")
export class Post {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  content: string;

  @Index()
  @ManyToOne(() => User, user => user.posts)
  author: User;

  @OneToMany(() => Like, like => like.post)
  likes: Like[];

  @OneToMany(() => PostHashtag, ph => ph.post)
  hashtags: PostHashtag[];

  @Index()
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}