/* istanbul ignore file */
import { knex as Knex } from 'knex'
import * as knexfile from './knexfile'

export const knex = Knex(knexfile)
