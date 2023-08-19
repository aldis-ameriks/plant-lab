/* istanbul ignore file */

import { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'
import modules from '../modules'
import { captureError } from '../modules/errors/helpers/captureError'
import { isLocal } from './config'
import { RequestContext } from './context'

const { loaders, resolvers, schema } = modules

export function initGraphql(app: FastifyInstance) {
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
            captureError(ctx, 'api', new Error(error.message), { ip: ctx?.ip, headers: ctx?.headers })
          }
          error.message = 'Technical Error'
        })
      }
      return response
    },
    context: (req) => req.ctx
  })

  app.register(mercuriusAuth, {
    async applyPolicy(authDirectiveAST, parent, args, context, _info) {
      const role = authDirectiveAST.arguments[0]?.value.value
      return (context as unknown as RequestContext).user?.roles.includes(role) === true
    },
    authDirective: 'auth'
  })
}
