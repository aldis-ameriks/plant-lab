/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-var-requires */
import fg from 'fast-glob'
import { FastifyInstance } from 'fastify'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Context } from '../helpers/context'
import { mergeDeep } from '../helpers/mergeDeep'

export type Job = { executing: boolean; running: boolean; name: string; id: number; stop: () => void }
export type JobInit = (context: Context) => Job

const files = fg.sync(
  [
    join(__dirname, './**/types.graphql'),
    join(__dirname, './**/*cron.(t|j)s'),
    join(__dirname, './**/resolvers.(t|j)s'),
    join(__dirname, './**/loaders.(t|j)s'),
    join(__dirname, './**/routes.(t|j)s')
  ],
  {
    ignore: [join(__dirname, './**/*test.(t|j)s')],
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
    const cron = require(file)
    if (cron.only) {
      cronOnlyModeEnabled = true
    }
    if (cron.disabled) {
      continue
    }

    cronFns.push(cron)
  } else if (file.includes('resolvers')) {
    resolvers.push(require(file).default)
  } else if (file.includes('loaders')) {
    loaders.push(require(file).default)
  } else if (file.includes('routes')) {
    routes.push(require(file).default)
  }
}

if (cronOnlyModeEnabled) {
  crons = cronFns.filter((cron) => cron.only).map((cron) => cron.default)
} else {
  crons = cronFns.map((cron) => cron.default)
}

export default {
  crons,
  routes,
  schema: types.join('\n'),
  loaders: mergeDeep(...loaders),
  resolvers: mergeDeep(...resolvers)
}
