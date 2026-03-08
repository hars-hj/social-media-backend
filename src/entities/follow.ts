import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique
} from "typeorm";
import { User } from "./User";

@Entity("follows")
@Unique(["follower", "following"])
export class Follow {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.following)
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  following: User;

  @CreateDateColumn()
  created_at: Date;
}