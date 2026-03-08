import { Router } from "express";
import { likePost, unlikePost } from "../controllers/like.controller";

const postrouter = Router();

postrouter.post("/:id/like", likePost);
postrouter.delete("/:id/unlike", unlikePost);

export default postrouter;