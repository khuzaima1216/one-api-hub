import pino from 'pino'
import fs from 'fs'
import path from 'path'

// Define log levels that match Pino's default levels
const LOG_LEVELS = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}

// Get log level from environment variable, default to 'info'
const getLogLevel = (): pino.LevelWithSilent => {
  const level = process.env.LOG_LEVEL?.toLowerCase()
  const validLevels = Object.keys(LOG_LEVELS) as Array<keyof typeof LOG_LEVELS>

  if (level && validLevels.includes(level as keyof typeof LOG_LEVELS)) {
    return level as pino.LevelWithSilent
  }

  return 'info'
}

// Ensure logs directory exists in production
const ensureLogsDirectory = () => {
  if (process.env.NODE_ENV === 'production') {
    const logsDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }
  }
}

// Create Pino configuration
const createPinoConfig = (): pino.LoggerOptions => {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  const baseConfig: pino.LoggerOptions = {
    level: getLogLevel(),
    base: {
      pid: process.pid,
      hostname: process.env.HOSTNAME || 'localhost',
      service: 'one-api-hub',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }

  if (isDevelopment) {
    // Pretty print for development
    return {
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      },
    }
  }

  // Production: structured JSON logs
  return baseConfig
}

// Create transport for production file logging
const createProductionTransports = () => {
  if (process.env.NODE_ENV !== 'production') {
    return undefined
  }

  ensureLogsDirectory()

  return pino.multistream([
    // Console output (JSON format)
    { stream: process.stdout, level: getLogLevel() },
    // Error log file
    {
      stream: pino.destination({
        dest: path.join(process.cwd(), 'logs', 'error.log'),
        sync: false,
        minLength: 4096,
      }),
      level: 'error',
    },
    // Combined log file
    {
      stream: pino.destination({
        dest: path.join(process.cwd(), 'logs', 'combined.log'),
        sync: false,
        minLength: 4096,
      }),
      level: getLogLevel(),
    },
  ])
}

// Create the logger instance
const createLoggerInstance = () => {
  const config = createPinoConfig()
  const transports = createProductionTransports()

  if (transports) {
    // Production with file logging
    return pino(config, transports)
  } else {
    // Development with pretty printing
    return pino(config)
  }
}

const logger = createLoggerInstance()

// Helper functions for structured logging with context
export const createLogger = (context?: string) => {
  const contextLogger = context ? logger.child({ context }) : logger

  return {
    trace: (message: string, meta?: Record<string, unknown>) => {
      contextLogger.trace(meta, message)
    },
    debug: (message: string, meta?: Record<string, unknown>) => {
      contextLogger.debug(meta, message)
    },
    info: (message: string, meta?: Record<string, unknown>) => {
      contextLogger.info(meta, message)
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      contextLogger.warn(meta, message)
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      contextLogger.error(meta, message)
    },
    fatal: (message: string, meta?: Record<string, unknown>) => {
      contextLogger.fatal(meta, message)
    },
  }
}

// Create a stream object for HTTP request logging (compatible with morgan or similar)
export const stream = {
  write: (message: string) => {
    logger.info({ type: 'http' }, message.trim())
  },
}

// Export the base logger and helper function
export { logger }
export default logger
