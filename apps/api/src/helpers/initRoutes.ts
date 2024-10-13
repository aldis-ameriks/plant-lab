/* node:coverage disable */

import { type FastifyInstance } from 'fastify'
import modules from '../modules/index.ts'

const { routes } = modules

interface Opts {
  app: FastifyInstance
}

export function initRoutes({ app }: Opts) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: Fix types
  routes.forEach(app.register)
}
