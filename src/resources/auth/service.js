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
  async store ({ email, password, ctx }) {
    const trx = await knex.transaction()

    try {
      const existEmail = await authHelper.checkEmail(email)
    } catch (error) {
      console.log(error)
      trx.rollback()
      throw error
    }
  }
}
