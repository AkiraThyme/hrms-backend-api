
const Koa = require('koa')
const koaRouter = require('koa-router')
const cors = require('@koa/cors')
const morgan = require('koa-morgan')
const Promise = require('bluebird')
const glob = Promise.promisify(require('glob'))
const { koaBody } = require('koa-body')
const { userAgent } = require('koa-useragent')
// const renderer = require('vue-server-renderer').createRenderer()
// const Vue = require('vue')
// const fs = require('fs')
// const path = require('path')
const _get = require('lodash/get')

// middlewares
const koaStatic = require('@middleware/koa-static')

// constants
const env = require('@constants/env')

async function getRoutes () {
  const router = koaRouter()
  const routePaths = await glob('src/resources/**/route.js', {
    cwd: process.cwd(),
    absolute: true
  })

  routePaths.forEach(routePath => {
    try {
      const route = require(routePath)({
        router: koaRouter()
      })

      router.use(route.routes())
    } catch (error) {
      console.log(`Something went wrong in ${routePath}`)
      throw error
    }
  })

  return router
}

async function getMiddlewares () {
  const middlewares = await glob('src/middleware/app-*.js', {
    cwd: process.cwd(),
    absolute: true
  })

  return middlewares.map(path => require(path))
}

module.exports = async () => {
  const router = await getRoutes()
  const middlewares = await getMiddlewares()

  const app = new Koa()

  app.proxy = true

  /**
   * Middlewares
   */
  app.use(cors())
  app.use(morgan('dev'))
  app.use(koaBody({ multipart: true }))
  app.use(router.allowedMethods())
  app.use(userAgent)
  middlewares.forEach(middleware => app.use(middleware()))
  app.use(koaStatic('/public', '/storage/app/public'))

  // const templateSource = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8')

  // router.get('/', async ctx => {
  //   const app = new Vue({
  //     data: {
  //       title: 'HRMS',
  //       content: 'Welcome to HRMS'
  //     },
  //     template: templateSource
  //   })

  //   try {
  //     const html = await renderer.renderToString(app)
  //     ctx.body = html
  //   } catch (err) {
  //     ctx.status = 500
  //     ctx.body = 'Internal Server Error'
  //     console.error(err)
  //   }
  // })

  /**
   * Routes
   */
  app.use(router.routes())

  app.listen(env.APP.PORT)

  return app
}
