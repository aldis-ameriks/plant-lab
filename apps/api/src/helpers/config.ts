/* istanbul ignore file */

// TODO: Add json schema validation for config
export const config = {
  env: process.env.API_ENV || 'local',
  maxHeap: process.env.API_MAX_HEAP ? +process.env.API_MAX_HEAP : undefined,
  maxRss: process.env.API_MAX_RSS ? +process.env.API_MAX_RSS : undefined,

  db: {
    host: process.env.API_DATABASE_HOST || 'localhost',
    port: +(process.env.API_DATABASE_PORT || '5432'),
    username: process.env.API_DATABASE_USERNAME || 'postgres',
    password: process.env.API_DATABASE_PASSWORD || 'postgres',
    database: process.env.API_DATABASE_NAME || 'db',
    ssl: process.env.API_DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  },

  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
    rateLimitDisabled: process.env.API_RATE_LIMIT_DISABLED === 'true'
  },

  worker: {
    isCronEnabled: process.env.API_CRON_ENABLED === 'true'
  },

  telegram: {
    accessKey: process.env.API_TG_TOKEN || undefined,
    receiver: process.env.API_TG_RECEIVER || undefined
  }
}

export const isLocal = config.env === 'local'
