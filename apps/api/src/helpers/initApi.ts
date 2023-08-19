/* istanbul ignore file */

import fastifyCors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import underPressure from '@fastify/under-pressure'
import fastify from 'fastify'
import pino from 'pino'
import modules from '../modules'
import { captureError } from '../modules/errors/helpers/captureError'
import { sendTelegram } from '../modules/errors/helpers/sendTelegram'
import { handleAbuse } from './abuse'
import { config, isLocal } from './config'
import { createContext, createRequestContext } from './context'
import { knex } from './db'
import { initGraphql } from './initGraphql'
import { Job } from './initModules'
import { shutdown } from './shutdown'

const { crons, routes } = modules

interface Opts {
  origins?: string[]
  graphql?: boolean
}

export async function initApi({ origins, graphql }: Opts) {
  const opts = {
    trustProxy: true,
    logger: {
      level: 'debug',
      timestamp: pino.stdTimeFunctions.isoTime,
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
    exposeStatusRoute: {
      routeOpts: {
        logLevel: 'warn'
      }
    }
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

  app.register(fastifyCors, { origin: origins ?? [], credentials: true })
  app.register(helmet, { hsts: false }) // nginx includes hsts

  if (graphql) {
    initGraphql(app)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: Fix types
  routes.forEach(app.register)

  app.decorateRequest('ctx', null)
  app.addHook('preValidation', async (req) => {
    if (req.body) {
      req.log.debug({ body: req.body }, 'request body')
    }

    req.ctx = await createRequestContext(
      Object.assign({}, context, { headers: req.headers, ip: req.ip, reqId: req.id })
    )
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

  app.setErrorHandler(async function (error, request, reply) {
    if (reply.raw.statusCode === 500) {
      await captureError(request.ctx, 'api', error, {
        ip: request.ip,
        headers: request.headers,
        req_id: request.id
      })
      request.log.error(error.toString())
      reply.send(new Error('Something went wrong'))
    } else {
      reply.send(error)
    }
  })

  const address = await app.listen({
    host: '0.0.0.0',
    port: process.env.API_SERVER_PORT ? +process.env.API_SERVER_PORT : 4000
  })
  app.log.info(`server started, listening on ${address} for incoming requests.`)
  app.log.info(`using environment: ${config.env}`)

  let cronJobs: Job[] = []
  if (config.worker.isCronEnabled && crons.length > 0) {
    cronJobs = crons.map((cron) => cron(context))
    context.log.info(`starting cron jobs: ${cronJobs.map((job) => job.name).join(', ')}`)
  }

  if (new Set(cronJobs.map((job) => job.id)).size !== cronJobs.length) {
    throw new Error('Duplicate cron job ids')
  }

  await shutdown(context, app.close, cronJobs)

  if (!isLocal) {
    try {
      await sendTelegram(context, 'api started')
    } catch (e) {
      context.log.error(e)
    }
  }
}
