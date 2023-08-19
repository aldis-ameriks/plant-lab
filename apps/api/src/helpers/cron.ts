/* istanbul ignore file */
import { CronJob } from 'cron'
import { randomUUID } from 'crypto'
import { captureError } from '../modules/errors/helpers/captureError'
import { Context } from './context'
import { Job } from './initModules'

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
  const job = new CronJob(
    schedule,
    async function (this: JobType) {
      // if exponential backoff enabled, check if cron should run
      const jobContext = Object.assign({}, context, {
        log: context.log.child({ job: jobName, executionId: randomUUID() })
      })

      if (this.executing) {
        return
      }

      try {
        const cron = await context
          .knex('crons')
          .insert({ id: `${jobId}`, name: jobName, next_execution_at: job.nextDate().toJSDate() })
          .onConflict('id')
          .merge()
          .returning('*')
          .then((rows) => rows[0])

        if (!cron.enabled) {
          return
        }

        this.executing = true

        await jobContext.knex.transaction(async (trx) => {
          const result = await trx
            .raw('SELECT pg_try_advisory_xact_lock(:id)', { id: jobId })
            .then((result) => result.rows[0])

          if (!result.pg_try_advisory_xact_lock) {
            const error = new Error(`failed to acquire lock for: ${jobName} (${jobId})`)
            context.log.error(error)
            await captureError(context, 'api', error)
            return
          }

          await run(jobContext)
          await trx('crons')
            .insert({
              id: `${jobId}`,
              name: jobName,
              executed_at: new Date(),
              next_execution_at: job.nextDate().toJSDate()
            })
            .onConflict('id')
            .merge()
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
    null,
    true,
    'UTC'
  ) as JobType

  job.name = jobName
  job.id = jobId
  job.executing = false

  return job
}
