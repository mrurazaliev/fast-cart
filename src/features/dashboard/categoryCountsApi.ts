import { z } from 'zod'
import { api } from '@/shared/api/client'
import { getCategories } from '@/features/categories/categoriesApi'

const countSchema = z.object({
  totalRecord: z.number().int().nonnegative(),
  data: z.object({ products: z.array(z.unknown()) }),
})

export type CategoryCount = { id: number; name: string; count: number }

export const getCategoryCounts = async (
  signal: AbortSignal,
): Promise<CategoryCount[]> => {
  const categories = await getCategories(signal)
  const counts: CategoryCount[] = []
  for (let offset = 0; offset < categories.length; offset += 3) {
    signal.throwIfAborted()
    const batch = await Promise.all(
      categories.slice(offset, offset + 3).map(async (category) => {
        const response = await api.get<unknown>('/Product/get-products', {
          params: { CategoryId: category.id, PageNumber: 1, PageSize: 1 },
          signal,
        })
        if (response.status === 204)
          return { id: category.id, name: category.categoryName, count: 0 }
        const result = countSchema.safeParse(response.data)
        if (
          !result.success ||
          result.data.data.products.length > result.data.totalRecord
        )
          throw new Error(
            'Unable to read complete category counts. Please try again.',
          )
        return {
          id: category.id,
          name: category.categoryName,
          count: result.data.totalRecord,
        }
      }),
    )
    counts.push(...batch)
  }
  return counts.sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  )
}
