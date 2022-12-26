/* istanbul ignore file */

// TODO: Add json schema validation for config
export const config = {
  env: process.env.API_ENV || 'local',
  maxHeap: process.env.API_MAX_HEAP ? +process.env.API_MAX_HEAP : undefined,
  maxRss: process.env.API_MAX_RSS ? +process.env.API_MAX_RSS : undefined,

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
