import { Router } from 'express';
import {Request,Response} from 'express';
import { getAllPosts, getPostById, createPost,DeletePost,updatePost } from '../controllers/post.controller';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema,updatePostSchema } from "../validations/post.validation";

export const postRouter = Router();

postRouter.get('/',getAllPosts);
postRouter.get('/:id',getPostById);
postRouter.post('/',validate(createPostSchema),createPost);
postRouter.put('/:id',validate(updatePostSchema),updatePost);
postRouter.delete('/:id',DeletePost);