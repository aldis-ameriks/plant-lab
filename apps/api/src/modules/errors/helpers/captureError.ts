import { Context } from '../../../helpers/context'
import { ErrorEntity } from '../../../types/entities'

export async function captureError(
  { knex, log }: Pick<Context, 'knex' | 'log'>,
  source: 'api' | 'web',
  payload: Record<string, unknown> | Error | string,
  rest?: Partial<Omit<ErrorEntity, 'id' | 'time' | 'source' | 'content' | 'sent_at'>>
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
    await knex<ErrorEntity>('errors').insert(Object.assign({}, { source, content }, rest))
  } catch (e) {
    log.error(e, 'failed to capture error')
  }
}
