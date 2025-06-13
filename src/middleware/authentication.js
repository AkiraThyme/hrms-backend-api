/**

const authentication = require('@middleware/authentication')

.use(authentication())

 */

const JWT = require('@utilities/jwt')
const userService = require('@resources/users/service')

module.exports = () => {
  return async (ctx, next) => {
    try {
      const bearerHeader = ctx.request.headers.authorization
      const token = String(bearerHeader).split(' ')[1]
      const verifiedToken = await JWT.verify(token)
      if (!verifiedToken) {
        ctx.throw(401, 'Invalid token')
      }

      if (Date.now() >= verifiedToken.exp * 1000) {
        ctx.throw(401, 'Token expired')
      }

      const user = await userService.getUser({ id: verifiedToken.data.id })

      ctx.state.auth = user
      return next()
    } catch (error) {
      console.log({
        origin: ctx.request.header.origin,
        ip: ctx.request.ip
      })
      console.error(error)
      ctx.throw(401)
    }
  }
}
