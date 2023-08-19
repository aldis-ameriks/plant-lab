/* istanbul ignore file */
import { join } from 'path'
import { config } from './config'

export const client = 'pg'

export const connection = {
  host: config.db.host,
  port: config.db.port,
  user: config.db.username,
  password: config.db.password,
  database: config.db.database,
  ssl: config.db.ssl
}

export const pool = {
  max: 5
}

export const migrations = {
  directory: join(__dirname, '..', '..', 'migrations'),
  loadExtensions: ['.js'],
  extension: 'js'
}
