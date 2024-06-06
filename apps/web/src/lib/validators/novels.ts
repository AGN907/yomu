import { z } from 'zod'

export const AddToLibrarySchema = z.object({
  novelId: z.number(),
  inLibrary: z.boolean(),
  categoryId: z.number().optional(),
})
