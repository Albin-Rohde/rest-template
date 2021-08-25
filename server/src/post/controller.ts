import {Router} from "express";
import {createPost, deletePost, getPost, getPosts} from "./services";
import {BadRequestError} from "../error";
import {RestResponse} from "../globalTypes";
import {Post} from "./models/Post";
import {asyncHandler} from "../middlewares";
import {CreatePostInput, createPostSchema, PostIdInput, postIdSchema, PostIdsInput, postIdsSchema} from "./schema";

const postRouter = Router()

postRouter.get('/:id', asyncHandler(async (req, res) => {
  const { id }: PostIdInput = postIdSchema.validateSync(req.params)
  if (!id) {
    throw new BadRequestError('id is required to get post')
  }
  return res.json({
    ok: true,
    data: await getPost(id)
  } as RestResponse<Post>)
}))

postRouter.get('/', asyncHandler(async (req, res) => {
  const {ids}: PostIdsInput = postIdsSchema.validateSync(req.query.params)
  return res.json({
    ok: true,
    data: await getPosts(ids)
  } as RestResponse<Post[]>)
}))

postRouter.post('/', asyncHandler(async (req, res) => {
  const postData: CreatePostInput = createPostSchema.validateSync(req.body)
  return res.status(201).json({
    ok: true,
    data: await createPost(postData)
  } as RestResponse<Post>)
}))

postRouter.delete('/:id', asyncHandler(async (req, res) => {
  const { id }: PostIdInput = postIdSchema.validateSync(req.params)
  await deletePost(id);
  return res.json({
    ok: true,
    data: null,
  } as RestResponse<null>)
}))

export default postRouter
