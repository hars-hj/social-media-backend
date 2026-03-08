import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Hashtag } from "../entities/Hashtag";
import { PostHashtag } from "../entities/postHashtag";

const userRepository = AppDataSource.getRepository(User);

export const getAllPosts = async (req:Request, res:Response)=>{
    try{
     
        const postRepository = AppDataSource.getRepository(Post);
        const allposts = await postRepository.find({
        relations: ["author"],
        order: {
            created_at: "DESC"
        }
    });
     
    res.json(allposts);

    }catch(error){
        res.status(500).json({message:"Error fetching posts", error});
    }
}



export const getPostById = async (req:Request, res:Response)=>{
    try{
        const postRepository = AppDataSource.getRepository(Post);

        const postId = parseInt(req.params.id);

        const post = await postRepository.findOne({
        where:{id:postId},
        relations: ['author']
    });
     
    if(!post){
        res.status(404).json({message:"post not found"});
    }
   else res.json(post);
    
    }catch(error){
        res.status(500).json({message:"Error fetching post", error});
    }
}




export const createPost = async (req: Request, res: Response) => {
  try {

    const { content, authorId } = req.body;

    const postRepo = AppDataSource.getRepository(Post);
    const userRepo = AppDataSource.getRepository(User);
    const hashtagRepo = AppDataSource.getRepository(Hashtag);
    const postHashtagRepo = AppDataSource.getRepository(PostHashtag);

    const user = await userRepo.findOneBy({ id: authorId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = postRepo.create({
      content,
      author: user
    });

    await postRepo.save(post);

    // Extract hashtags
    const hashtagMatches = content.match(/#(\w+)/g);

    if (hashtagMatches) {

      for (const tag of hashtagMatches) {
        
        const cleanedTag = tag.substring(1).toLowerCase();

        let hashtag = await hashtagRepo.findOneBy({ tag: cleanedTag });

        if (!hashtag) {
          hashtag = hashtagRepo.create({ tag: cleanedTag });
          await hashtagRepo.save(hashtag);
        }

        const postHashtag = postHashtagRepo.create({
          post,
          hashtag
        });

        await postHashtagRepo.save(postHashtag);
      }
    }

    return res.status(201).json(post);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error creating post" });

  }
};




export const updatePost = async (req:Request, res:Response)=>{
    try{
        const { content,id} = req.body;
        const postRepository = AppDataSource.getRepository(Post);

        const post = await postRepository.findOneBy({
        id: id
        });

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        
        post.content = content || post.content;

        await postRepository.save(post);

        res.json(post);
    }catch(error){
        res.status(500).json({message:"Error Updating post", error});
    }
}

export const DeletePost = async (req:Request, res:Response)=>{
    try{
        const {id} = req.body;
        const postRepository = AppDataSource.getRepository(Post);
       

        const post = await postRepository.findOneBy({
        id: Number(id)
        });

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        
        await postRepository.remove(post);

        res.json({message:"post deleted successfully"});

    }catch(error){
        res.status(500).json({message:"Error deleting post", error});
    }
}

export const getPostsByHashtag = async (req: Request, res: Response) => {

  try {

    const tag = req.params.tag.toLowerCase();

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const postRepo = AppDataSource.getRepository(Post);

    const posts = await postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoin("post.hashtags", "ph")
      .leftJoin("ph.hashtag", "hashtag")
      .where("LOWER(hashtag.tag) = :tag", { tag })
      .orderBy("post.created_at", "DESC")
      .take(limit)
      .skip(offset)
      .getMany();

    return res.json(posts);

  } catch (error) {

    console.error(error);
    return res.status(500).json({
      message: "Error fetching posts by hashtag"
    });

  }
};