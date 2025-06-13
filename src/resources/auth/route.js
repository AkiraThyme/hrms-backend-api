// controllers
const authController = require('@resources/auth/controller')
const auth = require('@middleware/authentication')

module.exports = ({ router }) => router
  .prefix('/auth')

  .post(
    '/login',
    authController.login
  )

  .post(
    '/register',
    authController.register
  )

  .get(
    '/fetch',
    auth(['user']),
    authController.getUser
  )
