import {Router} from "express";
import {createPost, deletePost, getPost, getPosts} from "./services";
import {BadRequestError} from "../error";
import {RestResponse} from "../globalTypes";
import {Post} from "./models/Post";
import {asyncHandler, loginRequired} from "../middlewares";
import {CreatePostInput, createPostSchema, PostIdInput, postIdSchema, PostIdsInput, postIdsSchema} from "./schema";
import {User} from "../user/models/User";

const postRouter = Router()
postRouter.use(loginRequired)

postRouter.get('/me', asyncHandler(async (req, res) => {
  return res.json({
    ok: true,
    data: await req.session.user.posts
  } as RestResponse<Post[]>)
}))

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
  const postInput: CreatePostInput = createPostSchema.validateSync(req.body)
  const user: User = req.session.user
  return res.status(201).json({
    ok: true,
    data: await createPost({...postInput, user})
  } as RestResponse<Post>)
}))

postRouter.delete('/:id', asyncHandler(async (req, res) => {
  const { id }: PostIdInput = postIdSchema.validateSync(req.params)
  await deletePost(id, req.session.user);
  return res.json({
    ok: true,
    data: null,
  } as RestResponse<null>)
}))

export default postRouter
