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

  async userLogin (ctx) {
    try {
      const body = ctx.request.body
      const response = await authService.vLogin({ ...body, ctx })
      ctx.body = response
    } catch (e) {
      ctx.throw(500, e)
    }
  },

  async userRegister (ctx) {
    try {
      const body = ctx.request.body

      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        employee_id: Joi.number().required()
      }).unknown()

      await schema.validateAsync({ ...body }, { abortEarly: false })
      const response = await authService.store({ ...body, ctx })
      if (response.status && response.status !== 200) {
        ctx.status = response.status
      }

      ctx.body = response
    } catch (e) {
      console.error('Error in userRegister:', e)
      ctx.throw(500, e)
    }
  },

  async employeeRegister (ctx) {
    try {
      const body = ctx.request.body

      const schema = Joi.object({
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        email: Joi.string().email().required(),
        job_id: Joi.number().optional(),
        level_id: Joi.number().optional(),
        hire_date: Joi.date().required(),
        dob: Joi.date().optional(),
        department_id: Joi.number().required(),
        manager_id: Joi.number().optional(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        province: Joi.string().optional(),
        postal_code: Joi.string().optional(),
        country: Joi.string().optional(),
        sss_no: Joi.string().optional(),
        phil_no: Joi.string().optional(),
        pagibig_no: Joi.string().optional()
      }).unknown()

      await schema.validateAsync({ ...body }, { abortEarly: false })

      const response = await authService.empregister({ ...body, ctx })

      if (response.status && response.status !== 200) {
        ctx.status = response.status
      }

      ctx.body = response
    } catch (e) {
      console.error('Error in employeeRegister:', e)
      ctx.throw(500, e)
    }
  }
}
