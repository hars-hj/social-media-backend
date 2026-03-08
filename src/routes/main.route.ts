import { Router } from 'express';
import { userRouter } from './user.routes';
import { postRouter } from './post.routes';
import followRouter from './follow.route';
import likeRouter from './likes.routes';
import { hashtagRouter } from './hashtag.route';
import feedRouter from './feed.route';


export const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/post', postRouter);
mainRouter.use('/user', followRouter);
mainRouter.use('/post', likeRouter);
mainRouter.use('/post', hashtagRouter);
mainRouter.use('/',feedRouter);