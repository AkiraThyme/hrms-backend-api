// controllers
const usersController = require('@resources/users/controller')
const auth = require('@middleware/authentication')

module.exports = ({ router }) => router
  .prefix('/users')

  .get(
    '/:id',
    usersController.user
  )

  .post(
    '/list',
    ctx => (ctx.status = 503),
    usersController.list
  )

  .post(
    '/find',
    ctx => (ctx.status = 503),
    usersController.find
  )

  .patch(
    '/',
    auth(['user']),
    usersController.patch
  )

  .delete(
    '/',
    ctx => (ctx.status = 503),
    usersController.delete
  )
