/* istanbul ignore file */
import { CronJob } from 'cron'
import { randomUUID } from 'crypto'
import { sql } from 'drizzle-orm'
import { captureError } from '../modules/errors/helpers/captureError'
import { Context } from './context'
import { Job } from './initModules'
import { crons } from './schema'

type JobType = CronJob & Job

export function getRandomSchedule() {
  return Math.trunc(Math.random() * 59)
}

export function createCronJob(
  context: Context,
  schedule: string,
  jobId: number,
  jobName: string,
  run: (context: Context) => Promise<void>
): JobType {
  const job = CronJob.from({
    cronTime: schedule,
    onTick: async function (this: JobType) {
      // if exponential backoff enabled, check if cron should run
      const jobContext = Object.assign({}, context, {
        log: context.log.child({ job: jobName, executionId: randomUUID() })
      })

      if (this.executing) {
        return
      }

      try {
        const cron = await context.db
          .insert(crons)
          .values({ id: jobId, name: jobName, nextExecutionAt: job.nextDate().toJSDate() })
          .onConflictDoUpdate({
            target: crons.id,
            set: { name: jobName, nextExecutionAt: job.nextDate().toJSDate() }
          })
          .returning()
          .then((result) => result[0])

        if (!cron?.enabled) {
          return
        }

        this.executing = true

        await jobContext.db.transaction(async (trx) => {
          const result = await trx.execute(sql`SELECT pg_try_advisory_xact_lock(${jobId})`).then((result) => result[0])

          if (!result.pg_try_advisory_xact_lock) {
            const error = new Error(`failed to acquire lock for: ${jobName} (${jobId})`)
            context.log.error(error)
            await captureError(context, 'api', error)
            return
          }

          await run(jobContext)
          await trx
            .insert(crons)
            .values({
              id: jobId,
              name: jobName,
              executedAt: new Date(),
              nextExecutionAt: job.nextDate().toJSDate()
            })
            .onConflictDoUpdate({
              target: crons.id,
              set: { name: jobName, executedAt: new Date(), nextExecutionAt: job.nextDate().toJSDate() }
            })
        })
      } catch (e) {
        let err = e
        if (e.isAxiosError) {
          let message = e.message

          if (e.response?.data) {
            message += ` response: ${JSON.stringify(e.response.data)}`
          }

          err = new Error(message)
        }

        jobContext.log.error(err, `${jobName} cron job failed`)
        await captureError(context, 'api', err)
      } finally {
        this.executing = false
      }
    },
    timeZone: 'UTC',
    start: true
  })

  Object.assign(job, { name: jobName, id: jobId, executing: false })

  return job as unknown as JobType
}
