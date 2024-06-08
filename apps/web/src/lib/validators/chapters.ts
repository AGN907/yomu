import { z } from 'zod'

export const MarkChapterAsReadSchema = z.object({
  chapterId: z.number(),
})
