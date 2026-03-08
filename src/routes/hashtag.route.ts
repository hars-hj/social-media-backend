import { Router } from 'express';
import { getPostsByHashtag } from '../controllers/post.controller';

export const hashtagRouter = Router();
hashtagRouter.get("/hashtag/:tag", getPostsByHashtag);

