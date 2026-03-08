import { Router } from "express";
import { getFeed } from "../controllers/feed.controller";

const feedRouter = Router();

feedRouter.get("/feed", getFeed);

export default feedRouter;