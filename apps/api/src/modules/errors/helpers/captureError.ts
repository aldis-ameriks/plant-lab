import { Context } from '../../../helpers/context'
import { errors } from '../../../helpers/schema'

export async function captureError(
  { db, log }: Pick<Context, 'db' | 'log'>,
  source: 'api' | 'web',
  payload: Record<string, unknown> | Error | string,
  rest?: Pick<typeof errors.$inferInsert, 'reqId' | 'headers' | 'ip'>
) {
  let content
  if (payload instanceof Error) {
    content = { error: payload.message, stack: payload.stack }
  } else if (typeof payload !== 'object') {
    content = { error: payload }
  } else {
    content = payload
  }

  try {
    // TODO: May want to consider buffering and inserting errors in batches.
    const value = Object.assign({}, { source, content }, rest)
    await db.insert(errors).values(value)
  } catch (e) {
    log.error(e, 'failed to capture error')
  }
}
