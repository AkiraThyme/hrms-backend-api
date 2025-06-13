/**
  Store common functionalities in services here
*/
const knex = require('@config/knex')
const { _jsonObject } = require('@utilities/knex-helper')
const _keyBy = require('lodash/keyBy')
const USERTABLE = 'hrms_users'
const EMPLOYEETABLE = 'hrms_employee'

module.exports = {
  UQ ({
    id
  }) {
    return knex({ u: USERTABLE })
      .select(
        {
          id: 'u.id',
          fname: 'e.fname',
          lname: 'e.lname',
          email: 'e.email',
          job_id: 'e.job_id',
          level_id: 'e.level_id',
          department_id: 'e.department_id'
        }
      )
      .join({ e: EMPLOYEETABLE }, 'u.emp_id', 'e.id')
      .where('u.id', id)
      .first()
  }
}
