/* node:coverage disable */

import fg from 'fast-glob'
import { type FastifyInstance } from 'fastify'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { type Context } from './context.ts'
import { mergeDeep } from './mergeDeep.ts'

export type Job = { executing: boolean; running: boolean; name: string; id: number; stop: () => void }
export type JobInit = (context: Context) => Job

export async function initModules() {
  const files = fg.sync(
    [
      join(import.meta.dirname, '../modules/**/types.graphql'),
      join(import.meta.dirname, '../modules/**/*cron.(t|j)s'),
      join(import.meta.dirname, '../modules/**/resolvers.(t|j)s'),
      join(import.meta.dirname, '../modules/**/loaders.(t|j)s'),
      join(import.meta.dirname, '../modules/**/routes.(t|j)s')
    ],
    {
      ignore: [join(import.meta.dirname, '../modules/**/*test.(t|j)s')],
      absolute: true
    }
  )

  const types: string[] = []

  const cronFns: { default: JobInit; only?: boolean; disabled?: boolean }[] = []
  let crons: JobInit[]
  let cronOnlyModeEnabled = false

  const routes: Array<(fastify: FastifyInstance) => Promise<void>> = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loaders: Array<any> = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvers: Array<any> = []

  for (const file of files) {
    if (file.includes('types.graphql')) {
      types.push(readFileSync(file).toString())
    } else if (file.includes('cron')) {
      const cron = await import(file)
      if (cron.only) {
        cronOnlyModeEnabled = true
      }
      if (cron.disabled) {
        continue
      }

      cronFns.push(cron)
    } else if (file.includes('resolvers')) {
      resolvers.push((await import(file)).default)
    } else if (file.includes('loaders')) {
      loaders.push((await import(file)).default)
    } else if (file.includes('routes')) {
      routes.push((await import(file)).default)
    }
  }

  if (cronOnlyModeEnabled) {
    crons = cronFns.filter((cron) => cron.only).map((cron) => cron.default)
  } else {
    crons = cronFns.map((cron) => cron.default)
  }

  return {
    crons,
    routes,
    schema: types.join('\n'),
    loaders: mergeDeep(...loaders),
    resolvers: mergeDeep(...resolvers)
  }
}
