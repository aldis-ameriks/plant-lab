/* node:coverage disable */

import modules from '../modules/index.ts'
import { type Context } from './context.ts'
import { type Job } from './initModules.ts'

const { crons } = modules

interface Opts {
  context: Context
}

export function initCron({ context }: Opts) {
  let cronJobs: Job[] = []
  if (context.config.worker.isCronEnabled && crons.length > 0) {
    cronJobs = crons.map((cron) => cron(context))
    context.log.info(`starting cron jobs: ${cronJobs.map((job) => job.name).join(', ')}`)
  }

  if (new Set(cronJobs.map((job) => job.id)).size !== cronJobs.length) {
    throw new Error('Duplicate cron job ids')
  }

  return cronJobs
}
