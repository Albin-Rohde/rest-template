import {Router} from "express";
import {createPost, deletePost, getPost, getPosts} from "./services";
import {BadRequestError} from "../error";
import {RestResponse} from "../globalTypes";
import {Post} from "./models/Post";
import {asyncHandler} from "../middlewares";

const postRouter = Router()

postRouter.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    throw new BadRequestError('id is required to get post')
  }
  return res.json({
    ok: true,
    data: await getPost(id)
  } as RestResponse<Post>)
}))

postRouter.get('/', asyncHandler(async (req, res) => {
  const ids = req.query.id;
  if (!ids || !Array.isArray(ids)) {
    throw new BadRequestError('ids is required in query string to get posts')
  }
  return res.json({
    ok: true,
    data: await getPosts(ids.map(id => Number(id)))
  } as RestResponse<Post[]>)
}))

postRouter.post('/', asyncHandler(async (req, res) => {
  const postData = req.body
  if (!postData) {
    throw new BadRequestError('data must be supplied to create a post')
  }
  if (!postData.text || !postData.title) {
    throw new BadRequestError('text and title required to create a post')
  }
  return res.status(201).json({
    ok: true,
    data: await createPost(postData)
  } as RestResponse<Post>)
}))

postRouter.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    throw new BadRequestError('id is required to delete post')
  }
  await deletePost(id);
  return res.json({
    ok: true,
    data: null,
  } as RestResponse<null>)
}))

export default postRouter
