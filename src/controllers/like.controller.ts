import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Like } from "../entities/Like";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

export const likePost = async (req: Request, res: Response) => {
  try {

    const userId = Number(req.body.userId);
    const postId = Number(req.params.id);

    const likeRepo = AppDataSource.getRepository(Like);
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);

    const user = await userRepo.findOneBy({ id: userId });
    const post = await postRepo.findOneBy({ id: postId });

    if (!user || !post) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    const existingLike = await likeRepo.findOne({
      where: {
        user: { id: userId },
        post: { id: postId }
      },
      relations: ["user", "post"]
    });

    if (existingLike) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const like = likeRepo.create({
      user,
      post
    });

    await likeRepo.save(like);

    return res.status(201).json({
      message: "Post liked successfully",
      like
    });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error liking post" });

  }
};

export const unlikePost = async (req: Request, res: Response) => {

  try {

    const userId = Number(req.body.userId);
    const postId = Number(req.params.id);

    const likeRepo = AppDataSource.getRepository(Like);

    const like = await likeRepo.findOne({
      where: {
        user: { id: userId },
        post: { id: postId }
      },
      relations: ["user", "post"]
    });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await likeRepo.remove(like);

    return res.json({
      message: "Post unliked successfully"
    });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error unliking post" });

  }
};