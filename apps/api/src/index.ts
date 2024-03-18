/* istanbul ignore file */
import pino from 'pino'
import { config, isLocal } from './helpers/config'
import { createContext } from './helpers/context'
import { db, postgres } from './helpers/db'
import { initApp } from './helpers/initApp'
import { initCron } from './helpers/initCron'
import { initGraphql } from './helpers/initGraphql'
import { initRoutes } from './helpers/initRoutes'
import { shutdown } from './helpers/shutdown'
import { sendTelegram } from './modules/errors/helpers/sendTelegram'

;(async () => {
  const log = pino({ level: 'debug', timestamp: pino.stdTimeFunctions.isoTime })
  const context = createContext({ db, postgres, log, config })
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
})()
