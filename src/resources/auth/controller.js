/* eslint-disable no-unused-vars */
// services
const authService = require('@resources/auth/service')

// libraries
const Joi = require('joi')

// utilities

module.exports = {
  async getUser (ctx) {
    ctx.body = ctx.state.auth
  },

  async login (ctx) {
    try {
      const body = ctx.request.body
      const response = await authService.vLogin({ ...body, ctx })
      ctx.body = response
    } catch (e) {
      ctx.throw(500, e)
    }
  },

  async register (ctx) {
    try {
      const body = ctx.request.body
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      }).unknown()

      await schema.validateAsync({ ...body }, { abortEarly: false })
      const response = await authService.store({ ...body, ctx })
      if (response.status && response.status !== 200) {
        ctx.status = response.status
      }

      ctx.body = response
    } catch (e) {
      ctx.throw(500, e)
    }
  }
}
