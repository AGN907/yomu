'use server'

import { and, db, desc, eq } from '@/lib/database'
import { getUserOrRedirect } from '../auth'

import {
  Novel,
  chapters,
  history,
  novels,
} from '@yomu/core/database/schema/web'

export const getLatestReadNovels = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  // TODO: Optimize query, ordering and limit to 4
  const rows = await db
    .select({
      id: novels.id,
      title: novels.title,
      url: novels.url,
      thumbnail: novels.thumbnail,
      sourceId: novels.sourceId,
      read: chapters.read,
    })
    .from(history)
    .innerJoin(novels, eq(history.novelId, novels.id))
    .orderBy(desc(history.updatedAt))
    .innerJoin(chapters, eq(novels.id, chapters.novelId))
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))

  return Object.values(
    rows.reduce(
      (acc, row) => {
        if (!acc[row.id]) {
          const { read, ...novel } = row
          acc[novel.id] = { novel: novel as Novel, chapters: [] }
        }
        acc[row.id].chapters.push({ read: row.read })
        return acc
      },
      {} as Record<string, { novel: Novel; chapters: { read: boolean }[] }>,
    ),
  ).slice(0, 4)
}
