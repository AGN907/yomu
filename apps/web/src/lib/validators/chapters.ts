import { z } from 'zod'

export const UpdateReadStateSchema = z.object({
  read: z.boolean(),
  chapterIds: z.array(z.number()),
})

export const GetChapterSchema = z.object({
  chapterId: z.number(),
  chapterNumber: z.number(),
})

export const LatestUpdatedChaptersSchema = z.object({
  limit: z.number().optional(),
})

export const FetchChapterContentSchema = z.object({
  sourceId: z.string(),
  chapterUrl: z.string(),
})

export const GetNextAndPreviousChapters = z.object({
  currentChapterNumber: z.number(),
  novelId: z.number(),
})
