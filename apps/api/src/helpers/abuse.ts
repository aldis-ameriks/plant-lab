import { FastifyRequest } from 'fastify'
import { lru } from 'tiny-lru'
import { captureError } from '../modules/errors/helpers/captureError'
import { Context } from './context'
import { abusers } from './schema'

const period = 15 * 60 * 1000 // 15 minutes
const abusersCache = lru(1024, period)

export async function handleAbuse(context: Context, req: FastifyRequest): Promise<void> {
  const ip = req.ip

  if (!abusersCache.get(ip)) {
    await captureError(context, 'api', new Error('api abuse'), {
      ip: req.ip,
      headers: JSON.stringify(req.headers),
      reqId: req.id
    })
    req.log.warn({ ip, url: req.url, method: req.method, headers: req.headers }, 'registering abuser')
    abusersCache.set(ip, true)
    await context.db.insert(abusers).values({ ip, url: req.url, method: req.method, headers: req.headers })
  }

  return
}
