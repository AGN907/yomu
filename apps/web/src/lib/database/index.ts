import { betterSqliteDrizzle } from '@yomu/core/database'
import * as schema from '@yomu/core/database/schema/web'

import Database from 'better-sqlite3'

const DATABASE_PATH = process.env.DATABASE_PATH

const sql = new Database(DATABASE_PATH)

export const db = betterSqliteDrizzle(sql, { schema })

export * from '@yomu/core/database/helpers'
