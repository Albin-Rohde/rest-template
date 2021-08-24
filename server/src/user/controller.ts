import { Router, Request, Response } from 'express'
import {asyncHandler, loginRequired} from '../middlewares'
import {createUser, getUserByEmail} from './services'
import {RestResponse} from "../globalTypes";
import {User} from "./models/User";
import {AuthenticationError, BadRequestError} from "../error";
import bcrypt from "bcrypt";
import {CreateUserInput, createUserSchema, LoginInput, loginSchema} from "./schema";

const userRouter = Router()


userRouter.get('/', loginRequired, (req: Request, res: Response): Response => {
  const response: RestResponse<User> = {
    ok: true,
    err: null,
    data: req.session.user
  }
  return res.json(response)
})

userRouter.post('/login', asyncHandler(async (req: Request, res: Response) => {
  if(req.session.user) {
    return res.status(200).json({
      ok: true,
      err: null,
      data: req.session.user
    } as RestResponse<User>)
  }
  const loginInput: LoginInput = loginSchema.validateSync(req.body)
  const user = await getUserByEmail(loginInput.email)
  if(!user) {
    throw new AuthenticationError(`Could not find <User> with email ${req.body.email}`)
  }
  if(!await bcrypt.compare(loginInput.password, user.password)) {
    throw new AuthenticationError('Incorrect password')
  }
  req.session.user = user
  req.session.save(() => null)
  const response: RestResponse<User> = {
    ok: true,
    err: null,
    data: user
  }
  res.json(response)
}))

userRouter.post('/logout', loginRequired, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  req.session.destroy(() => res.json({ok: true, err: null, data: {}} as RestResponse<any>))
  return
}))


userRouter.post('/register',asyncHandler(async (req: Request, res: Response) => {
  const createUserInput: CreateUserInput = createUserSchema.validateSync(req.body)
  const user = await createUser(createUserInput)
  req.session.user = user
  req.session.save(() => null)
  const response: RestResponse<User> = {
    ok: true,
    err: null,
    data: user,
  }
  res.json(response)
}))

export default userRouter
