import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";

export const getFeed = async (req: Request, res: Response) => {

  try {

    const userId = Number(req.query.userId);

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const postRepo = AppDataSource.getRepository(Post);

    const posts = await postRepo
      .createQueryBuilder("post")

      .leftJoinAndSelect("post.author", "author")

      .leftJoin("post.likes", "likes")

      .leftJoin("post.hashtags", "ph")
      .leftJoin("ph.hashtag", "hashtag")

      .leftJoin("follows", "follow", "follow.followingId = author.id")

      .where("follow.followerId = :userId", { userId })

      .loadRelationCountAndMap("post.likeCount", "post.likes")

      .orderBy("post.created_at", "DESC")

      .take(limit)
      .skip(offset)

      .getMany();

    return res.json({
      limit,
      offset,
      posts
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Error generating feed"
    });

  }
};