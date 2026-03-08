import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Follow } from "../entities/follow";
import { User } from "../entities/User";



export const followUser = async (req: Request, res: Response) => {
  try {

    const followerId = Number(req.body.followerId);
    const followingId = Number(req.params.id);

    const userRepo = AppDataSource.getRepository(User);
    const followRepo = AppDataSource.getRepository(Follow);

    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const follower = await userRepo.findOneBy({ id: followerId });
    const following = await userRepo.findOneBy({ id: followingId });

    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingFollow = await followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId }
      },
      relations: ["follower", "following"]
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    const follow = followRepo.create({
      follower,
      following
    });

    await followRepo.save(follow);

    return res.status(201).json({
      message: "User followed successfully",
      follow
    });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error following user" });

  }

};



export const unfollowUser = async (req: Request, res: Response) => {

  try {

    const followerId = Number(req.body.followerId);
    const followingId = Number(req.params.id);

    const followRepo = AppDataSource.getRepository(Follow);

    const follow = await followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId }
      },
      relations: ["follower", "following"]
    });

    if (!follow) {
      return res.status(404).json({ message: "Follow not found" });
    }

    await followRepo.remove(follow);

    return res.json({
      message: "User unfollowed successfully"
    });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error unfollowing user" });

  }
};


export const getFollowers = async (req: Request, res: Response) => {
  try {

    const userId = Number(req.params.id);

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const followRepo = AppDataSource.getRepository(Follow);

    const [followers, total] = await followRepo.findAndCount({
      where: {
        following: { id: userId }
      },
      relations: ["follower"],
      order: {
        created_at: "DESC"
      },
      take: limit,
      skip: offset
    });

    const formattedFollowers = followers.map(f => ({
      id: f.follower.id,
      username: f.follower.firstName + " " + f.follower.lastName,
      email: f.follower.email,
      followed_at: f.created_at
    }));

    return res.json({
      totalFollowers: total,
      limit,
      offset,
      followers: formattedFollowers
    });

  } catch (error) {

    console.error(error);
    return res.status(500).json({
      message: "Error fetching followers"
    });

  }
};