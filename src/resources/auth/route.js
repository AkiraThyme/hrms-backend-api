// controllers
const authController = require('@resources/auth/controller')
const auth = require('@middleware/authentication')

module.exports = ({ router }) => router
  .prefix('/auth')

  .post(
    '/login',
    authController.userLogin
  )

  .post(
    '/register',
    authController.userRegister
  )

  .post(
    '/register/employee',
    authController.employeeRegister
  )

  .get(
    '/fetch',
    auth(['ADMIN']),
    authController.getUser
  )

  .get(
    '/fetch/employee',
    authController.fetchEmployeeId
  )
