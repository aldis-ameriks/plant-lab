/* node:coverage disable */

import { type FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'
import modules from '../modules/index.ts'
import { captureError } from '../modules/errors/helpers/captureError.ts'
import { isLocal } from './config.ts'
import { type RequestContext } from './context.ts'

const { loaders, resolvers, schema } = modules

type Opts = {
  app: FastifyInstance
}

export function initGraphql({ app }: Opts) {
  app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    jit: 1,
    queryDepth: 20,
    graphiql: isLocal,
    subscription: true,
    // TODO: Fix mercurius types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorFormatter: (err, ctx: any) => {
      app.log.error({ err }, 'error occurred')
      const response = mercurius.defaultErrorFormatter(err, ctx)
      if (response.response?.errors && Array.isArray(response.response.errors)) {
        response.response.errors.forEach((error) => {
          if (error.message !== 'Unknown query') {
            captureError(ctx, 'api', new Error(error.message), { ip: ctx?.ip, headers: ctx?.headers }).catch(() => {})
          }

          if (
            !error.message.includes('Failed auth policy') &&
            !error.message.includes('Forbidden') &&
            !error.message.includes('Invalid input')
          ) {
            // error.message = 'Technical Error'
          }
        })
      }
      return response
    },
    context: (req) => req.ctx
  })

  app.register(mercuriusAuth, {
    async applyPolicy(authDirectiveAST, _parent, _args, context, _info) {
      const role = authDirectiveAST.arguments[0]?.value.value
      return (context as unknown as RequestContext).user?.roles.includes(role) === true
    },
    authDirective: 'auth'
  })
}
