/* istanbul ignore file */

import { FastifyInstance } from 'fastify'
import modules from '../modules'

const { routes } = modules

interface Opts {
  app: FastifyInstance
}

export function initRoutes({ app }: Opts) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: Fix types
  routes.forEach(app.register)
}
