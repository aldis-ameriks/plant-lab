import type { Config } from 'drizzle-kit'
import { join, relative } from 'node:path'

export default {
  schema: relative(join(import.meta.dirname, '../..'), 'src/helpers/schema.ts'),
  out: relative(join(import.meta.dirname, '../..'), 'migrations'),
  dialect: 'postgresql'
} satisfies Config
