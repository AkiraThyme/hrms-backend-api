/* eslint-disable no-unused-vars */
// libraries
const Joi = require('joi')

// services
const service = require('@resources/employees/service')
module.exports = {
  async getEmployees (ctx) {
    try {
      const employees = await service.getAllEmployees()
      ctx.body = employees
      ctx.status = 200
      ctx.message = 'Employees fetched successfully'
    } catch (error) {
      console.error('Error in getEmployees:', error)
      ctx.throw(500, error)
    }
  }
}
