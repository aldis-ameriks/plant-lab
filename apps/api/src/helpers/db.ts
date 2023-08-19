/* istanbul ignore file */
import { knex as Knex } from 'knex'
import * as knexfile from './knexfile'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const knex = Knex<any, any>(knexfile)
