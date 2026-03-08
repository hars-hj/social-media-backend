import { Router } from "express";
import { followUser, unfollowUser,getFollowers } from "../controllers/follow.controller";

const followRouter = Router();

followRouter.post("/:id/follow", followUser);
followRouter.delete("/:id/unfollow", unfollowUser);
followRouter.get("/:id/followers", getFollowers);
export default followRouter;