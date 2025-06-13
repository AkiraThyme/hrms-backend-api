const knexMeta = require('@jeash/knex-meta').default

const knex = knexMeta(require('knex'))

// constants
const env = require('@constants/env')

module.exports = knex({
  client: env.DB.CLIENT || 'mysql',

  connection: {
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASS,
    database: env.DB.NAME,
    port: env.DB.PORT,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    dateStrings: true,

    typeCast (field, next) {
      try {
        if (field.type === 'JSON') {
          const string = field.string()

          return string && JSON.parse(string)
        }

        return next()
      } catch (err) {
        console.log(err)
      }
    }
  }
})
