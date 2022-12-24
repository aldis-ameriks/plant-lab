import { RequestContext } from '../helpers/context'

declare module 'fastify' {
  interface FastifyRequest {
    ctx: RequestContext
  }
}
