/* istanbul ignore file */
import fastifyCors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import underPressure from '@fastify/under-pressure'
import fastify from 'fastify'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'
import pino from 'pino'
import { handleAbuse } from './helpers/abuse'

import { config, isLocal } from './helpers/config'
import { createContext, createRequestContext } from './helpers/context'
import { knex } from './helpers/db'
import { shutdown } from './helpers/shutdown'
import modules, { Job } from './modules'
import { captureError } from './modules/errors/helpers/captureError'
import { CronEntity } from './types/entities'

const { crons, loaders, resolvers, routes, schema } = modules

async function init() {
  const opts = {
    trustProxy: true,
    logger: {
      level: 'debug',
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url,
            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket.remotePort
          }
        },
        res(res) {
          return {
            statusCode: res.statusCode,
            operationName: res.request.body?.operationName,
            url: res.request.url,
            method: res.request.method,
            ip: res.request.ctx?.ip
          }
        }
      }
    }
  }

  const app = fastify(opts)
  const context = createContext({ knex, log: app.log, config })

  app.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: config.maxHeap,
    maxRssBytes: config.maxRss,
    maxEventLoopUtilization: 0.98,
    exposeStatusRoute: true
  })
  if (!config.api.rateLimitDisabled) {
    app.register(fastifyRateLimit, {
      errorResponseBuilder: (req, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        handleAbuse(context, req).catch(() => {})
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded, retry in ${ctx.after}`
        }
      }
    })
  }
  app.register(fastifyCors)
  app.register(helmet, { hsts: false }) // nginx includes hsts

  app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    jit: 1,
    queryDepth: 20,
    graphiql: isLocal,
    subscription: true,
    errorFormatter: (err, ctx: any) => {
      app.log.error({ err }, 'error occurred')
      const response = mercurius.defaultErrorFormatter(err, ctx)
      if (response.response?.errors && Array.isArray(response.response.errors)) {
        response.response.errors.forEach((error) => {
          if (error.message !== 'Unknown query') {
            captureError(context, 'api', new Error(error.message), { ip: ctx?.ip, headers: ctx?.headers })
          }
          error.message = 'Technical Error'
        })
      }
      return response
    },
    context: (req) => req.ctx
  })

  app.register(mercuriusAuth, {
    async authContext(_context) {
      // let accessKey = context.reply.request.headers['x-access-key']
      return {
        user: null
      }
    },
    async applyPolicy(authDirectiveAST, parent, args, context, _info) {
      const role = authDirectiveAST.arguments[0]?.value.value
      return context.auth?.user.roles.includes(role)
    },
    authDirective: 'auth'
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: Fix types
  routes.forEach(app.register)

  app.decorateRequest('ctx', null)
  app.addHook('preHandler', async (req, _reply) => {
    if (req.body) {
      req.log.debug({ body: req.body }, 'request body')
    }

    req.ctx = createRequestContext(Object.assign({}, context, { headers: req.headers, ip: req.ip, reqId: req.id }))
    req.ctx.log = req.log as pino.Logger
  })

  app.register(
    (instance, _opts, done) => {
      instance.head('/', async () => 'head')
      instance.get('/ping', async () => 'pong')
      instance.get('/memory', async () => app.memoryUsage())
      done()
    },
    { logLevel: 'warn' }
  )

  app.register(async (instance) => {
    instance.get('/crons', async (req) => {
      const crons = await req.ctx.knex<CronEntity>('crons').orderBy('name')
      return crons
        .map((cron) => {
          const refDate = new Date()
          refDate.setMinutes(refDate.getMinutes() - 10)
          if (new Date(cron.next_execution_at) < refDate) {
            return `NOK ${cron.name}`
          } else {
            return `OK ${cron.name}`
          }
        })
        .join('\n')
    })
  })

  app.setErrorHandler(async function (error, request, reply) {
    if (reply.raw.statusCode === 500) {
      await captureError(request.ctx, 'api', error, { ip: request.ip, headers: request.headers, req_id: request.id })
      request.log.error(error.toString())
      reply.send(new Error('Something went wrong'))
    } else {
      reply.send(error)
    }
  })

  const address = await app.listen(process.env.API_SERVER_PORT ? +process.env.API_SERVER_PORT : 4000, '0.0.0.0')
  app.log.info(`Server started, listening on ${address} for incoming requests.`)
  app.log.info(`Using environment: ${config.env}`)

  let cronJobs: Job[] = []
  if (config.worker.isCronEnabled && crons.length > 0) {
    cronJobs = crons.map((cron) => cron(context))
    context.log.info(`starting cron jobs: ${cronJobs.map((job) => job.name).join(', ')}`)
  }

  if (new Set(cronJobs.map((job) => job.id)).size !== cronJobs.length) {
    throw new Error('Duplicate cron job ids')
  }

  await shutdown(context, app.close, cronJobs)
}

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  await init()
})()
