/* node:coverage disable */
import pino from 'pino'
import { config, isLocal } from './helpers/config.ts'
import { createContext } from './helpers/context.ts'
import { db, postgres } from './helpers/db.ts'
import { initApp } from './helpers/initApp.ts'
import { initCron } from './helpers/initCron.ts'
import { initGraphql } from './helpers/initGraphql.ts'
import { initRoutes } from './helpers/initRoutes.ts'
import { shutdown } from './helpers/shutdown.ts'
import { sendTelegram } from './modules/errors/helpers/sendTelegram.ts'

const log = pino({ level: 'debug', timestamp: pino.stdTimeFunctions.isoTime })
const context = createContext({ db, sql: postgres, log, config })
const app = initApp({ context })
initRoutes({ app })
initGraphql({ app })
const cronJobs = initCron({ context })

const address = await app.listen({
  host: '0.0.0.0',
  port: context.config.port
})

app.log.info(`server started, listening on ${address} for incoming requests.`)
app.log.info(`using environment: ${config.env}`)

shutdown(context, app.close, cronJobs)

if (!isLocal) {
  try {
    await sendTelegram(context, `${context.config.name}(${context.config.env}): api started`)
  } catch (e) {
    context.log.error(e)
  }
}
