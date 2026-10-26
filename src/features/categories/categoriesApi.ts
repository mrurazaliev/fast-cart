import { z } from 'zod'
import { api } from '@/shared/api/client'

const categorySchema = z.object({
  id: z.number(),
  categoryName: z.string(),
  subCategories: z.array(
    z.object({ id: z.number(), subCategoryName: z.string() }),
  ),
})
const categoriesResponseSchema = z.object({ data: z.array(categorySchema) })

export type Category = z.infer<typeof categorySchema>

export const getCategories = async (
  signal: AbortSignal,
): Promise<Category[]> => {
  const response = await api.get<unknown>('/Category/get-categories', {
    signal,
  })
  const result = categoriesResponseSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to read categories. Please try again.')
  return result.data.data
}
