import type { Config } from 'drizzle-kit'

export default {
  schema: './src/helpers/schema.ts',
  out: './migrations',
  dialect: 'postgresql'
} satisfies Config
