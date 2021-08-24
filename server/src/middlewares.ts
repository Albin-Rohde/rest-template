import { User } from "./user/models/User";

import { NextFunction, Request, Response } from "express";
import {
  AuthenticationError,
  ExpectedError,
  NotFoundError,
} from "./error";
import { RestResponse } from "./globalTypes";
import { logger } from "./logger/logger";
import {ValidationError} from "yup";


const authUser = async (sessionUser: User) => {
  if(!sessionUser) {
    throw new AuthenticationError('NO_SESSION_USER')
  }
  const user = await User.findOne(sessionUser.id, {relations: ['game', 'game._users']})
  if(!user) {
    throw new NotFoundError(`Could not find <User> with id ${sessionUser.id}`)
  }
  if(user.email !== sessionUser.email || user.password !== sessionUser.password) {
    throw new AuthenticationError('AUTH_FAILED')
  }
  return user
}

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  req.session.user = await authUser(req.session.user)
  req.session.save(() => null)
  next()
}

export const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};


export const handleRestError = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const response: RestResponse<null> = {
    ok: false,
    err: {
      message: err.message,
      name: err.name
    },
    data: null
  }
  if (err instanceof ExpectedError) {
    logger.error(err)
    return res.status(200).json(response);
  }
  if (err instanceof ValidationError) {
    logger.warn(err)
    return res.status(400).json({name: err.name, message: err.message});
  }
  // makes sure any unexpected error is not sent to client.
  logger.error(err)
  response.err = {name: 'INTERNAL_ERROR', message: 'UNKNOWN_INTERNAL_ERROR'}
  return res.status(500).json(response)
}

