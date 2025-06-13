const axios = require('axios')

// constants
const env = require('@constants/env')
const _ = require('lodash')

const baseApi = (() => {
  const instance = axios.create()

  return instance
})()

const clientApi = (() => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'secret-key': env.APP.SECRET_KEY
    }
  })

  const successResponse = response => {
    const status = _.get(response, 'data.status', 200)
    const customMessage = `${_.toUpper(response.config.method)} ${response.config.url}`

    if (status !== 'success') {
      throw new Error(`Client responded with a status: "${status}" - ${customMessage}`)
    }

    return response
  }

  const errorResponse = err => {
    const error = err.toJSON()
    const customMessage = `${_.toUpper(error.config.method)} ${error.config.url}`

    throw new Error(`${error.message} - ${customMessage}`)
  }

  instance.interceptors.response.use(
    successResponse,
    errorResponse
  )

  return instance
})()

module.exports = {
  baseApi,
  clientApi
}
