import { NextFunction, Request, Response } from "express";
import {
  ExpectedError,
} from "./error";
import { RestResponse } from "./globalTypes";
import { logger } from "./logger/logger";
import {ValidationError} from "yup";


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
    logger.warn(err)
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

