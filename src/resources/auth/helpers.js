/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/**
  Store common functionalities in services here
*/

const knex = require('@config/knex')
const bcrypt = require('@utilities/bcrypt')
const USERTABLE = 'hrms_users'
const EMPLOYEETABLE = 'hrms_employee'

module.exports = {

  async getUser ({
    email,
    userId
  }) {
    const user = await knex({ u: USERTABLE })
      .select({
        id: 'u.id',
        email: 'e.email',
        name: 'u.name',
        password: 'u.password',
        role: 'u.role'
      })
      .join({ e: EMPLOYEETABLE }, 'u.emp_id', 'e.id')
      .where('is_active', 1)
      .modify(q => {
        if (userId) {
          q.where('u.id', userId)
        } else {
          q.where('e.email', email)
        }
      })
      .first()

    return user
  },

  updateUser ({
    user,
    updateData,
    trx = knex
  }) {
    return trx(USERTABLE)
      .where('id', user.id)
      .update(updateData)
  },

  async validatePassword ({
    email,
    password
  }) {
    try {
      const user = await this.getUser({ email })

      if (!user) {
        return {
          status: 422,
          message: 'Invalid email'
        }
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return {
          status: 422,
          message: 'Invalid password'
        }
      }

      return {
        status: 200,
        user
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async checkEmail (email) {
    return await knex({ u: USERTABLE })
      .join({ e: EMPLOYEETABLE }, 'u.emp_id', 'e.id')
      .where('e.email', email)
      .limit(1)
  },

  async checkEmployee (email) {
    const employee = await knex(EMPLOYEETABLE)
      .select('*')
      .where('email', email)
      .first()

    return employee
  },

  async checkEmployeeById (employee_id) {
    const employee = await knex(EMPLOYEETABLE)
      .select('*')
      .where('id', employee_id)
      .first()

    return employee
  },

  async getEmployeeByEmail (email) {
    return await knex(EMPLOYEETABLE)
      .select('id')
      .where('email', email)
      .first()
  }
}
