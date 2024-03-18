/* istanbul ignore file */
import util from 'util'
import { captureError } from '../modules/errors/helpers/captureError'
import { Context } from './context'
import { Job } from './initModules'

const sleep = util.promisify(setTimeout)

let shuttingDown = false

export function shutdown(
  context: Context,
  close: () => Promise<void>,
  jobs?: Job[],
  opts?: { timeoutMs: number }
): void {
  const { log } = context
  const closeAll = async () => {
    if (Array.isArray(jobs) && jobs.length) {
      for (const job of jobs) {
        if (job.running) {
          job.stop()
        }

        if (job.executing) {
          log.warn(`Job '${job.name}' is still executing`)
          await sleep(1000)
          return closeAll()
        }
      }
      log.info('Jobs stopped')
    }

    log.info('Closing server')
    await close()
    log.info('Server closed')
  }

  process.on('unhandledRejection', async (reason) => {
    await captureError(context, 'api', { error: reason })
    log.error(reason ?? 'unhandledRejection')
    await initiateShutdown(context, 'unhandledRejection', reason, closeAll, opts)
  })

  process.on('uncaughtException', async (err) => {
    await captureError(context, 'api', { error: err })
    log.error(err)
    await initiateShutdown(context, 'uncaughtException', err, closeAll, opts)
  })
  ;(['SIGTERM', 'SIGINT'] as const).forEach((event) => {
    process.on(event, async (err) => {
      log.warn(err)
      await initiateShutdown(context, event, err, closeAll, opts)
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function initiateShutdown(context: Context, event, err: any, close: () => void, opts) {
  const { log } = context

  if (shuttingDown) {
    return
  }

  log.warn(`Server shutting down: ${event}`)
  shuttingDown = true
  const timeoutMs = opts?.timeoutMs ?? 30 * 1000

  setTimeout(async () => {
    log.error(`Shutdown taking longer than expected, exceeding ${timeoutMs}ms, killing process`)
    process.exit(1)
  }, timeoutMs).unref()

  try {
    await close()

    log.info('Closing connection pool')
    await context.postgres.end()
  } catch (e) {
    log.error(e, 'Failed to close server')
    process.exit(1)
  }

  log.info('Exiting')
  process.exit(0)
}
