import { z } from 'zod'

export const subcategoryFormSchema = z.object({
  subCategoryName: z.string().trim().min(1, 'Enter a subcategory name.'),
  categoryId: z
    .number()
    .int()
    .positive('Choose a parent category.')
    .max(2147483647),
})

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>
