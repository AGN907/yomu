import { z } from 'zod'

export const AddChapterToHistorySchema = z.object({
  novelId: z.number(),
  chapterId: z.number(),
})
