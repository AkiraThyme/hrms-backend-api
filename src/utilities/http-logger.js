const path = require('path')
const createLogger = require('@utilities/create-logger')

const root = process.cwd()

module.exports = createLogger({
  filename: path.join(root, '/storage/logs', 'http-%DATE%.log')
})
