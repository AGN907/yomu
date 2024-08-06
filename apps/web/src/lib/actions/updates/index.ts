'use server'

import { db, desc, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { UpdateNovelSchema } from '@/lib/validators/novels'
import { getUserOrRedirect } from '../auth'
import { fetchNovel } from '../novels'

import {
  chapters,
  novels,
  updatedChapters,
} from '@yomu/core/database/schema/web'

import { revalidatePath } from 'next/cache'
import { fetchNovelChapters } from '../chapters'

export const updateNovel = authAction(
  UpdateNovelSchema,
  async ({ novelId }, { userId }) => {
    try {
      const selectedNovel = await db.query.novels.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.userId, userId), eq(table.id, novelId)),
        with: {
          chapters: {
            columns: { id: true, number: true },
          },
        },
      })

      if (!selectedNovel) {
        return {
          error:
            "Couldn't find a novel matching the provided id, update aborted",
        }
      }

      const { sourceId, url, sourceNovelId } = selectedNovel
      const [{ data: novel }, { data: novelChapters }] = await Promise.all([
        fetchNovel({ sourceId, url }),
        fetchNovelChapters({ sourceId, url, sourceNovelId }),
      ])

      if (!novel || !novelChapters) {
        return {
          error: 'Failed to fetch latest novel data, update aborted',
        }
      }

      const [{ inLibrary }] = await db
        .update(novels)
        .set({
          ...novel,
        })
        .where(eq(novels.id, novelId))
        .returning({ inLibrary: novels.inLibrary })

      const savedChapters = selectedNovel.chapters
      const lastSavedChapterNum = savedChapters[savedChapters.length - 1].number

      const newChapters = novelChapters
        .filter((c) => c.number > lastSavedChapterNum)
        .map((c) => ({ ...c, novelId }))

      const isNewChapters = newChapters.length > 0
      console.log(
        newChapters.length,
        novelChapters.length,
        savedChapters.length,
      )
      if (isNewChapters) {
        const newInsertedChapters = await db
          .insert(chapters)
          .values(newChapters.map((c) => ({ ...c, userId })))
          .returning({
            chapterId: chapters.id,
            novelId: chapters.novelId,
          })

        if (inLibrary) {
          await db
            .insert(updatedChapters)
            .values(newInsertedChapters.map((c) => ({ ...c, userId })))
        }

        return {
          success: `Novel was updated, ${newChapters.length} new chapters were added`,
        }
      }
      return {
        success: 'Novel was updated, no new chapters were added',
      }
    } catch (error) {
      return {
        error: "Something went wrong, couldn't update novel",
      }
    } finally {
      revalidatePath('/novel')
    }
  },
)

export const getUpdatedChapters = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  try {
    return await db
      .select({
        novelId: novels.id,
        novelTitle: novels.title,
        novelUrl: novels.url,
        novelThumbnail: novels.thumbnail,
        sourceId: novels.sourceId,
        chapterId: chapters.id,
        chapterTitle: chapters.title,
        chapterUrl: chapters.url,
        chapterNumber: chapters.number,
        id: updatedChapters.id,
        createdAt: updatedChapters.createdAt,
        updatedAt: updatedChapters.updatedAt,
      })
      .from(novels)
      .where(eq(novels.userId, userId))
      .innerJoin(chapters, eq(novels.id, chapters.novelId))
      .innerJoin(updatedChapters, eq(chapters.id, updatedChapters.chapterId))
      .orderBy(desc(updatedChapters.updatedAt), desc(chapters.number))
  } catch (error) {
    console.error(error)
    return []
  }
}
