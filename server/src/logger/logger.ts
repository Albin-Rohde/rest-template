import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import {silly} from "winston";

/**
 * Custom Json formatter for formatting winston log files to json
 */
const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry) => {
  const base = { timestamp: new Date() };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}

const winstonFileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.json(),
  winston.format(jsonFormatter)()
)

const winstonConsoleFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.prettyPrint(),
)

/**
 * Logger for express, specifically requests. Will pick upp all requests from
 * express and log it to the requests.log file.
 */
export const expressLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'requests.log' }),
  ],
  format: winstonFileFormat,
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return req.url.includes('/logs')
  }
})

/**
 * All purpose logger, user for logging errors and other info's
 */
export const logger = winston.createLogger({
  format: winstonFileFormat,
  defaultMeta: {service: 'Server'},
  transports: [
    new winston.transports.Console({ format: winstonConsoleFormat, level: 'silly' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log',level: 'info' }),
  ],
})
