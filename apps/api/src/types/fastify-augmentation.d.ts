import { type RequestContext } from '../helpers/context.ts'

declare module 'fastify' {
  interface FastifyRequest {
    ctx: RequestContext
  }
}
