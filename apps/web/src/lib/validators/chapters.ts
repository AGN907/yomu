import { z } from 'zod'

export const MarkChapterAsReadSchema = z.object({
  chapterId: z.number(),
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
