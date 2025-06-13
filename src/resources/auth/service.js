/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const knex = require('@config/knex')
const authHelper = require('@resources/auth/helpers')

const _get = require('lodash/get')
const _first = require('lodash/first')
const _castArray = require('lodash/castArray')
const bcrypt = require('@utilities/bcrypt')

const USERTABLE = 'hrms_users'
const EMPLOYEETABLE = 'hrms_employee'

module.exports = {
  async store ({ email, password, employee_id, ctx }) {
    const trx = await knex.transaction()

    try {
      // Check if the employee ID exists
      const employee = await authHelper.checkEmployeeById(employee_id)

      if (!employee) {
        return {
          status: 422,
          message: 'Invalid employee ID'
        }
      }

      // Check if the email already exists
      const existEmail = await authHelper.checkEmail(email)

      if (existEmail && existEmail.length > 0) {
        return {
          status: 422,
          message: 'Email already exists'
        }
      }

      // Hash the password
      const hashPassword = await bcrypt.hash(password)

      // Insert user data into the database
      const [userId] = await trx(USERTABLE)
        .insert({
          emp_id: employee_id,
          email,
          password: hashPassword
        })

      await trx.commit()

      return {
        status: 201,
        message: 'User registered successfully',
        userId
      }
    } catch (error) {
      console.error('Error in store:', error)
      trx.rollback()
      throw error
    }
  },

  async vLogin ({ email, password, ctx }) {
    try {
      const trxProvider = knex.transactionProvider()
      const trx = await trxProvider()
      const user = await authHelper.getUser({ email })
      console.log('User found:', user)

      console.log('Email:', email)
      console.log('Password:', password)

      if (!user) {
        return {
          status: 422,
          message: 'Invalid email'
        }
      }

      if (!user.password) {
        console.error('Error: User password is undefined')
        return {
          status: 500,
          message: 'Server error: Missing password for user'
        }
      }

      const sanitizedPasswordHash = user.password.trim()

      const isValidPassword = await bcrypt.verify({
        password,
        hash: sanitizedPasswordHash
      })

      if (!isValidPassword) {
        return {
          status: 422,
          message: 'Invalid password'
        }
      }

      await trx.commit()
      return {
        status: 200,
        message: 'Login successful'
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async empregister ({ fname, lname, email, job_id, level_id, hire_date, dob, department_id, manager_id, address, city, province, postal_code, country, sss_no, phil_no, pagibig_no, ctx }) {
    const trx = await knex.transaction()

    try {
      // Check if the email already exists
      const existEmail = await authHelper.checkEmail(email)

      if (existEmail && existEmail.length > 0) {
        return {
          status: 422,
          message: 'Email already exists'
        }
      }

      // Insert employee data into the database
      const [employeeId] = await trx(EMPLOYEETABLE).insert({
        fname,
        lname,
        email,
        job_id,
        level_id,
        hire_date,
        dob,
        department_id,
        manager_id,
        address,
        city,
        province,
        postal_code,
        country,
        sss_no,
        phil_no,
        pagibig_no
      })

      await trx.commit()

      return {
        status: 201,
        message: 'Employee registered successfully',
        employeeId
      }
    } catch (error) {
      console.error('Error in empregister:', error)
      trx.rollback()
      throw error
    }
  }
}
