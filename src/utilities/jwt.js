const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

const env = require('@constants/env')

function sign (payload, _options) {
  const options = Object.assign({
    expiresIn: env.JWT.EXPIRES_IN
  }, _options)
  return jwt.signAsync(
    { data: payload },
    env.JWT.SECRET_KEY,
    options
  )
}

function verify (token) {
  try {
    return jwt.verifyAsync(token, env.JWT.SECRET_KEY)
  } catch (error) {
    console.log('VERIFY TOKEN', error.message)
    throw new Error(401, error.message)
  }
}

module.exports = {
  sign,
  verify
}
