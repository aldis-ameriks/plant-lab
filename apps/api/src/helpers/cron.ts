/* istanbul ignore file */
import { CronJob } from 'cron'
import { randomUUID } from 'crypto'
import { Job } from '../modules'
import { captureError } from '../modules/errors/helpers/captureError'
import { Context } from './context'

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
        this.executing = true

        await jobContext.knex.transaction(async (trx) => {
          const result = await trx
            .raw('SELECT pg_try_advisory_xact_lock(:id)', { id: jobId })
            .then((result) => result.rows[0])

          if (!result.pg_try_advisory_xact_lock) {
            // TODO: Capture error for multiple consecutive fails
            context.log.error(`failed to acquire lock for: ${jobName} (${jobId})`)
            return
          }

          await run(jobContext)
          await trx('crons')
            .insert({ id: jobId, name: jobName, executed_at: new Date(), next_execution_at: job.nextDate() })
            .onConflict('id')
            .merge()
        })
      } catch (e) {
        let err = e
        if (e.isAxiosError) {
          err = new Error(e.message)
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
