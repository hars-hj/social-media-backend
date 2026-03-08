import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from "typeorm";
import { PostHashtag } from "./postHashtag";

@Entity("hashtags")
export class Hashtag {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tag: string;

  @OneToMany(() => PostHashtag, postHashtag => postHashtag.hashtag)
  posts: PostHashtag[];

  @CreateDateColumn()
  created_at: Date;
}