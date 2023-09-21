import { createLogger, format, transports } from 'winston'
import path from 'path'
// import winston from 'winston'

const { combine, timestamp, printf } = format

const logFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)


// winston.add(new winston.transports.MongoDB({
//     db: 'mongodb://127.0.0.1:27017/blog',
//     level: 'info'
//     }))
const log = 'log'
const DirName = 'userActions'
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const logNull = createLogger({
  level: 'debug',
  format: combine(
    timestamp({ format: dateFormat }),
    logFormat
  ),
  transports: [new transports.File({ filename: path.join(log, 'NullError.log') })]
})

const logDB = createLogger({
  level: 'debug',
  format: combine(
    timestamp({ format: dateFormat }),
    logFormat
  ),
  transports: [new transports.File({ filename: path.join(log, 'DatabaseError.log') })]
})

const logUnhandledRejection = createLogger({
    level: 'debug',
    format: combine(
        timestamp({ format: dateFormat }),
        logFormat
    ),
    transports: [new transports.File({ filename: path.join(log, 'UnhandledRejection.log') })]
})
const logHighAlert = createLogger({
  level: 'warn',
  format: combine(
    timestamp({ format: dateFormat }),
    logFormat
  ),
  transports: [new transports.File({ filename: path.join(log, 'HighAlert.log') })]
})

const logUserAuth = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: dateFormat }),
    logFormat
  ),
  transports: [new transports.File({ filename: path.join(log, 'UserAuth.log') })]
})

const logCatchError = createLogger({
  level: 'error',
  format: combine(
    timestamp({ format: dateFormat }),
    logFormat
  ),
  transports: [new transports.File({ filename: path.join(log, 'CatchError.log') })]
})



export { logNull, logDB, logHighAlert, logUserAuth, logCatchError, logUnhandledRejection }
