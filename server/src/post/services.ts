import {Post} from "./models/Post";
import {NotFoundError} from "../error";
import {User} from "../user/models/User";

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

interface createPostInput {
  title: string
  text: string
  user: User
}
export const createPost = async (input: createPostInput): Promise<Post> => {
  const post = Post.create({
    text: input.text,
    title: input.title,
  })
  post.user = Promise.resolve(input.user)
  await post.save()
  return post
}

export const deletePost = async (id: number, user: User): Promise<void> => {
  const res = await Post.createQueryBuilder('post')
    .where('post.id = :id', {id})
    .andWhere('post.user_id_fk = :userId', {userId: 1})
    .delete()
    .execute()
  if (res.affected <= 0) {
    throw new NotFoundError(`Could not delete post with id ${id}`)
  }
  return
}
