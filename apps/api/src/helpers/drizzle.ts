import type { Config } from 'drizzle-kit'
import { join, relative } from 'node:path'

export default {
  schema: relative(join(__dirname, '../..'), 'src/helpers/schema.ts'),
  out: relative(join(__dirname, '../..'), 'migrations'),
  dialect: 'postgresql'
} satisfies Config
