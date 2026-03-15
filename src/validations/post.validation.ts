import Joi from "joi";

export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  userId: Joi.number().integer().positive().required(),
});

export const updatePostSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});