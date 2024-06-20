import '@dotenvx/dotenvx'
import { defineConfig } from 'drizzle-kit'

const DATABASE_PATH = process.env.DATABASE_PATH as string

export default defineConfig({
  dialect: 'sqlite',
  schema: '../../packages/core/src/database/schema/web.ts',
  out: './drizzle',
  dbCredentials: {
    url: DATABASE_PATH,
  },
  migrations: {
    table: 'migrations',
    schema: 'public',
  },
})
