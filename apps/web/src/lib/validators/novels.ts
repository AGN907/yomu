import { z } from 'zod'

export const AddToLibraryScehma = z.object({
  novelId: z.number(),
  inLibrary: z.boolean(),
})
