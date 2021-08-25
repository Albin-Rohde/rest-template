import "reflect-metadata";
import dotenv from 'dotenv'
import { createConnection } from "typeorm";
import { logger, expressLogger } from "./logger/logger";
import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import {handleRestError} from "./middlewares";

dotenv.config({path: '.env'})

export interface ServerOptions {
  port: number
  clientUrl: string
}

export const userSession = session({
  name: 'sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 864000,
    httpOnly: false,
    sameSite: false,
  }
})

declare module 'express-session' {
  export interface SessionData {
    destroy: () => void
    save: () => void
  }
}


/**
 * Start the web server
 * Will start one express rest server
 * Will start one socket.io websocket server
 */
async function startServer() {
  const options: ServerOptions = {
    port: Number(process.env.PORT),
    clientUrl: process.env.CLIENT_URL!,
  }
  try {
    await createConnection()
    logger.info('Connected to db')
    logger.debug(options)

    const app: Application = express()
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.set('trust proxy', true)
    app.use(cors({origin: options.clientUrl, credentials: true}))
    app.use((_req, res, next) => {
      res.header({'Access-Control-Allow-Headers': options.clientUrl})
      next()
    })
    app.use(userSession)
    app.use(expressLogger)
    registerRoutes(app)
    app.use(handleRestError);
    app.listen(options.port, () => {
      logger.info(`server started on port ${options.port}`)
    })
  } catch (err) {
    logger.error(err)
  }
}

function registerRoutes(app: Application) {
  return
}

startServer()
