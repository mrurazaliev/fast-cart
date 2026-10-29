import { z } from 'zod'

export const categoryFormSchema = z.object({
  categoryName: z.string().trim().min(1, 'Enter a category name.'),
  categoryImage: z
    .instanceof(File)
    .nullable()
    .refine((file): boolean => file !== null, 'Choose a new category image.')
    .refine((file) => !file || file.size > 0, 'Choose a non-empty image.')
    .refine(
      (file) => !file || !file.type || file.type.startsWith('image/'),
      'Choose an image file.',
    ),
})
export type CategoryFormValues = z.infer<typeof categoryFormSchema>
