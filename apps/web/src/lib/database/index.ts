import { betterSqliteDrizzle } from '@yomu/core/database'
import * as schema from '@yomu/core/database/schema/web'

import Database from 'better-sqlite3'

const sql = new Database('./yomu.db')

export const db = betterSqliteDrizzle(sql, { schema })

export * from '@yomu/core/database/helpers'
