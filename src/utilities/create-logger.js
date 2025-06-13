const winston = require('winston')
const path = require('path')
const DailyRotateFile = require('winston-daily-rotate-file')

module.exports = ops => {
  const root = process.cwd()

  const opsWithDefaultValues = {
    filename: path.join(root, '/storage/logs', '%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    ...ops
  }

  const logger = winston.createLogger({
    level: 'info'
  })

  const dailyRotateFile = new DailyRotateFile(opsWithDefaultValues)

  logger.configure({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.json()
    ),
    transports: [
      dailyRotateFile
    ]
  })

  logger.info(new Error('asdf'))

  return logger
}
