import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Like } from "./entities/Like";
import { Follow } from "./entities/follow";
import { Hashtag } from "./entities/Hashtag";
import { PostHashtag } from "./entities/postHashtag";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: false,
  logging: false,
  entities: [
    User,
    Post,
    Like,
    Follow,
    Hashtag,
    PostHashtag
  ],
  migrations: ["src/migrations/*.ts"],
});