/* istanbul ignore file */
import { join } from 'path'

const KNEX = {
  HOST: process.env.API_DATABASE_HOST || 'localhost',
  PORT: +(process.env.API_DATABASE_PORT || '5432'),
  USERNAME: process.env.API_DATABASE_USERNAME || 'postgres',
  PASSWORD: process.env.API_DATABASE_PASSWORD || 'postgres',
  DATABASE: process.env.API_DATABASE_NAME || 'db',
  SSL: process.env.API_DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
}

export const client = 'pg'

export const connection = {
  host: KNEX.HOST,
  user: KNEX.USERNAME,
  password: KNEX.PASSWORD,
  port: KNEX.PORT,
  database: KNEX.DATABASE,
  ssl: KNEX.SSL
}

export const pool = {
  max: 5
}

export const migrations = {
  directory: join(__dirname, '..', '..', 'migrations'),
  loadExtensions: ['.js'],
  extension: 'js'
}
