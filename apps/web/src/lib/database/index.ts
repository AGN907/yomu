import { betterSqliteDrizzle } from '@yomu/core/database'
import * as schema from '@yomu/core/database/schema/web'

import Database from 'better-sqlite3'

const databasePath =
  //   process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : './yomu.db'
  './database/yomu.db'

const sql = new Database(databasePath)

export const db = betterSqliteDrizzle(sql, { schema })

export * from '@yomu/core/database/helpers'
