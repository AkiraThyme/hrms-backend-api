/**

const authentication = require('@middleware/authentication')

.use(authentication())

 */

const JWT = require('@utilities/jwt')
const userService = require('@resources/users/service')

module.exports = (requiredRoles = []) => {
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

      if (!user) {
        ctx.throw(401, 'User not found')
      }

      // Check if the user has the required role
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        ctx.throw(403, 'Forbidden: Insufficient permissions')
      }

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
