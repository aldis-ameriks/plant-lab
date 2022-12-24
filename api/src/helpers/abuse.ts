import { FastifyRequest } from 'fastify'
import { lru } from 'tiny-lru'
import { captureError } from '../modules/errors/helpers/captureError'
import { AbuserEntity } from '../types/entities'
import { Context } from './context'

const period = 15 * 60 * 1000 // 15 minutes
const abusers = lru(1024, period)

export async function handleAbuse(context: Context, req: FastifyRequest): Promise<void> {
  const ip = req.ip

  if (!abusers.get(ip)) {
    await captureError(context, 'api', new Error('api abuse'), {
      ip: req.ip,
      headers: JSON.stringify(req.headers),
      req_id: req.id
    })
    req.log.warn({ ip, url: req.url, method: req.method, headers: req.headers }, 'registering abuser')
    abusers.set(ip, true)
    await context.knex<AbuserEntity>('abusers').insert({ ip, url: req.url, method: req.method, headers: req.headers })
  }

  return
}
