import { Router } from 'express';
import {Request,Response} from 'express';
import { getAllPosts, getPostById, createPost,DeletePost,updatePost } from '../controllers/post.controller';

export const postRouter = Router();

postRouter.get('/',getAllPosts);
postRouter.get('/:id',getPostById);
postRouter.post('/',createPost);
postRouter.put('/:id',updatePost);
postRouter.delete('/:id',DeletePost);