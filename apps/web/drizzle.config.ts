import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: '../../packages/core/src/database/schema/web.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'yomu.db',
  },
  migrations: {
    table: 'migrations',
    schema: 'public',
  },
})
