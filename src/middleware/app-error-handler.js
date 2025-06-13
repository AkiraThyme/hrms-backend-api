const httpLogger = require('@utilities/http-logger')
const _ = require('lodash')
module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.log(error.stack)

      httpLogger.error(error)

      let validationError = false

      if (!_.isEmpty(error.details) || (error.details && error.details.length > 0)) {
        error.status = 422
        let errorObject = {}
        const errors = error.details.map(detail => ({
          [detail.path[0]]: detail.message
        }))

        // Convert the array to a single object
        errorObject = errors.reduce((acc, e) => {
          const key = Object.keys(e)[0]
          acc[key] = e[key]
          return acc
        }, {})

        validationError = errorObject
      }

      ctx.status = error.status || 500
      ctx.body = {
        status: ctx.status,
        name: error.name,
        message: error.message,
        params: error?.params,
        errors: error.body,
        validationError
      }
    }
  }
}
