// Description: Routes for employee-related operations
const controller = require('@resources/employees/controller')

module.exports = ({ router }) => router
  .get(
    '/employees',
    controller.getEmployees
  )
