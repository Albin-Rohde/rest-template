import {Post} from "./models/Post";
import {NotFoundError} from "../error";

export const getPost = async (id: number): Promise<Post> => {
  try {
    return Post.findOneOrFail(id)
  } catch (err) {
    throw new NotFoundError(err);
  }
}

export const getPosts = async (ids: number[]): Promise<Post[]> => {
  return Post.findByIds(ids)
}

interface createPostData {
  title: string
  text: string
}
export const createPost = async (data: createPostData): Promise<Post> => {
  const post = Post.create(data)
  await post.save()
  return post
}

export const deletePost = async (id: number): Promise<void> => {
  const res = await Post.delete(id)
  if (res.affected <= 0) {
    throw new NotFoundError(`Could not delete post with id ${id} since it does not exist in db`)
  }
}
