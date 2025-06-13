// services
const usersService = require('@resources/users/service')

// helpers
const authHelper = require('@resources/auth/helpers')

// libraries
const Joi = require('joi')

// utilities
const { createFindArguments } = require('@utilities/knex-helper')

module.exports = {
  async list (ctx) {
    const body = ctx.request.body

    ctx.body = await usersService.list({ ...body })
  },

  async find (ctx) {
    ctx.body = await usersService.list({
      ...createFindArguments(ctx.request.body),
      is_first: true
    })

    ctx.status = 200
  },

  async store (ctx) {
    const schema = Joi.object({})

    const body = await schema.validateAsync(ctx.request.body)

    ctx.body = await usersService.store({
      body
    })
  },

  async patch (ctx) {
    const schema = Joi.object({
      id: Joi.number().required(),
      password: Joi.string().optional()
    })

    const body = await schema.validateAsync(ctx.request.body)
    const auth = ctx.state.auth

    const result = await authHelper.validatePassword({
      email: auth.email, password: body.password
    })

    if (result.status === 422) {
      ctx.status = result.status
      ctx.body = result
      return result
    }

    ctx.body = await usersService.modify({
      keys: ['id'],
      body
    })
  },

  async delete (ctx) {
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    const data = await schema.validateAsync(ctx.request.body)

    await usersService.delete({
      ids: data.id
    })

    ctx.status = 200
  },

  async user (ctx) {
    const response = await usersService.getUser({ ...ctx.params })
    ctx.body = response
  }
}
