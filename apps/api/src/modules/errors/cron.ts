import { eq, isNull } from 'drizzle-orm'
import { inArray } from 'drizzle-orm/sql/expressions/conditions'
import { Context } from '../../helpers/context'
import { createCronJob, getRandomSchedule } from '../../helpers/cron'
import { errors } from '../../helpers/schema'
import { sendTelegram } from './helpers/sendTelegram'

export default /* istanbul ignore next */ function start(context) {
  return createCronJob(context, `${getRandomSchedule()} * * * * *`, 1004, 'errors', run)
}

export async function run(context: Context) {
  const { db, log, config } = context
  const unsentErrors = await db.query.errors.findMany({ where: isNull(errors.sentAt) })

  if (unsentErrors.length) {
    log.warn(`found ${unsentErrors.length} unsent errors`)

    if (unsentErrors.length > 5) {
      await sendTelegram(context, `[${config.env}]: there are ${unsentErrors.length} errors`)
      const errorIds = unsentErrors.map((error) => error.id)
      await db.update(errors).set({ sentAt: new Date() }).where(inArray(errors.id, errorIds))
    } else {
      for (const error of unsentErrors) {
        await sendTelegram(context, `[${error.source ?? 'unknown'}-${config.env}]: ${JSON.stringify(error.content)}`)
        await db.update(errors).set({ sentAt: new Date() }).where(eq(errors.id, error.id))
      }
    }
  }
}
