import { Context } from '../../helpers/context'
import { createCronJob, getRandomSchedule } from '../../helpers/cron'
import { ErrorEntity } from '../../types/entities'
import { sendTelegram } from './helpers/sendTelegram'

/* istanbul ignore next */
export default function start(context) {
  return createCronJob(context, `${getRandomSchedule()} * * * * *`, 1004, 'errors', run)
}

export async function run(context: Context) {
  const { knex, log, config } = context
  const errors = await knex<ErrorEntity>('errors').where('sent_at', null)
  if (errors.length) {
    log.warn(`found ${errors.length} unsent errors`)

    if (errors.length > 5) {
      await sendTelegram(context, `[${config.env}]: there are ${errors.length} errors`)
      const errorIds = errors.map((error) => error.id)
      await knex<ErrorEntity>('errors').update('sent_at', new Date()).whereIn('id', errorIds)
    } else {
      for (const error of errors) {
        await sendTelegram(context, `[${error.source ?? 'unknown'}-${config.env}]: ${JSON.stringify(error.content)}`)
        await knex<ErrorEntity>('errors').update('sent_at', new Date()).where('id', error.id)
      }
    }
  }
}
