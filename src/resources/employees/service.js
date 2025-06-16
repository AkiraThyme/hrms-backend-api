/* eslint-disable no-unused-vars */
const knex = require('@config/knex')
const helper = require('@resources/employees/helpers')

module.exports = {
  async getAllEmployees () {
    try {
      const employees = await helper.fetchEmployees()
      return employees
    } catch (error) {
      console.error('Error fetching all employees:', error)
      throw error
    }
  }
}
