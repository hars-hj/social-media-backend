import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from "typeorm";
import { Post } from "./Post";
import { Hashtag } from "./Hashtag";

@Entity("post_hashtags")
export class PostHashtag {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.hashtags)
  post: Post;

  @ManyToOne(() => Hashtag, hashtag => hashtag.posts)
  hashtag: Hashtag;
}