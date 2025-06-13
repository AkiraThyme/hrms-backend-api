const knex = require('@config/knex')
const helper = require('@resources/users/helpers')

const _get = require('lodash/get')
const _first = require('lodash/first')
const _castArray = require('lodash/castArray')

module.exports = {
  async list (query) {
    const {
      is_count: isCount,
      is_first: isFirst
    } = query

    const fields = {
      id: {
        column: 'users.id',
        filterable: true,
        sortable: true
      }
    }

    try {
      const list = await knex('hrms_users as users')
        .metaQuery(query, fields)
        .modify(function () {
          if (isCount) {
            this
              .count({ total: 'users.id' })
              .first()
          } else {
            this.select({
              id: 'users.id'
            })
          }

          if (isFirst) {
            this.limit(1)
          }
        })

      if (isCount) {
        return _get(list, 'total', 0)
      }

      return isFirst ? _first(list) : list
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async getUser ({ id }) {
    try {
      const result = await helper.UQ({ id })
      if (!result) {
        throw new Error(`User with id ${id} not found`)
      }

      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
