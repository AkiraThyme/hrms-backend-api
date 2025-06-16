/* eslint-disable no-unused-vars */

const knex = require('@config/knex')
const USERTABLE = 'hrms_users'
const EMPLOYEETABLE = 'hrms_employee'

module.exports = {
  fetchEmployees () {
    return knex({ e: EMPLOYEETABLE })
      .select(
        {
          id: 'e.id',
          fname: 'e.fname',
          lname: 'e.lname',
          email: 'e.email',
          job_id: 'e.job_id',
          level_id: 'e.level_id',
          department_id: 'e.department_id'
        }
      )
      .where('e.is_active', 1)
  }
}
