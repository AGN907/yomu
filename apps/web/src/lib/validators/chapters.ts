import { z } from 'zod'

export const GetNovelChaptersSchema = z.object({
  novelId: z.number(),
})

export const MarkChapterAsReadSchema = z.object({
  chapterIds: z.array(z.number()),
})

export const GetNextAndPreviousChaptersSchema = z.object({
  chapterId: z.number(),
})
