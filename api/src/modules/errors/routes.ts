import { FastifyInstance } from 'fastify'
import { captureError } from './helpers/captureError'

export default async function errorRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: Array<Record<string, string>> }>('/error', async (req, res) => {
    req.ctx.log.error(req.body, 'capturing error')

    for (const error of req.body) {
      await captureError(req.ctx, 'frontend', error, {
        req_id: req.id,
        ip: req.ip,
        headers: JSON.stringify(req.headers)
      })
    }

    res.send('OK')
  })
}
