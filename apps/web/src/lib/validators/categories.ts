import { z } from 'zod'

export const CreateNewCategoryScehma = z.object({
  name: z
    .string()
    .min(1, 'Please provide a name')
    .max(31, 'Name is too long. Maximum length is 31 characters'),
})
