/* istanbul ignore file */

import fastifyCors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import underPressure from '@fastify/under-pressure'
import fastify, { FastifyBaseLogger } from 'fastify'
import { captureError } from '../modules/errors/helpers/captureError'
import { handleAbuse } from './abuse'
import { Context, createRequestContext } from './context'

interface Opts {
  context: Context
  origins?: string[]
}

export function initApp({ context, origins }: Opts) {
  const app = fastify({
    trustProxy: true,
    logger: context.log.child(
      {},
      {
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
              foo: 'bar',
              statusCode: res.statusCode,
              operationName:
                !!res.request?.body && typeof res.request.body === 'object' && 'operationName' in res.request.body
                  ? res.request.body.operationName
                  : undefined,
              url: res.request?.url,
              method: res.request?.method,
              ip: res.request?.ctx?.ip
            }
          }
        }
      }
    ) as FastifyBaseLogger
  })

  app.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: context.config.maxHeap,
    maxRssBytes: context.config.maxRss,
    maxEventLoopUtilization: 0.98,
    exposeStatusRoute: {
      routeOpts: {
        logLevel: 'warn'
      }
    }
  })

  if (!context.config.api.rateLimitDisabled) {
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

  app.decorateRequest('ctx', null)
  app.addHook('preValidation', async (req) => {
    if (req.body) {
      req.log.debug({ body: req.body }, 'request body')
    }

    req.ctx = await createRequestContext(
      Object.assign({}, context, { headers: req.headers, ip: req.ip, reqId: req.id })
    )

    // may not need to reassign
    // req.ctx.log = req.log as pino.Logger
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
        reqId: request.id
      })
      request.log.error(error.toString())
      reply.send(new Error('Something went wrong'))
    } else {
      reply.send(error)
    }
  })

  return app
}
