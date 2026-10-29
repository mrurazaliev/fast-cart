import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { isCategoryMutationConfirmed } from './categoriesApi'
import type { Category } from './categoriesApi'
import type { SubcategoryFormValues } from './subcategoryFormSchema'

const idSchema = z.number().int().positive().max(2147483647)
const subcategorySchema = z.object({
  id: idSchema,
  subCategoryName: z.string(),
})

export type Subcategory = z.infer<typeof subcategorySchema>

export const getSubcategoryParent = (categories: Category[], id: number) => {
  const parents = categories.filter((category) =>
    category.subCategories.some((subcategory) => subcategory.id === id),
  )
  return parents.length === 1 ? parents[0] : null
}

export const getSubcategory = async (
  id: number,
  signal: AbortSignal,
): Promise<Subcategory | null> => {
  idSchema.parse(id)
  try {
    const response = await api.get<unknown>(
      '/SubCategory/get-sub-category-by-id',
      {
        params: { id },
        signal,
      },
    )
    if (response.status === 204) return null
    const parsed = z
      .object({ data: subcategorySchema })
      .safeParse(response.data)
    if (!parsed.success || parsed.data.data.id !== id)
      throw new Error('Unable to read this subcategory.')
    return parsed.data.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export const createSubcategory = async (
  values: SubcategoryFormValues,
  signal: AbortSignal,
) => {
  const response = await api.post<unknown>(
    '/SubCategory/add-sub-category',
    null,
    {
      params: {
        CategoryId: values.categoryId,
        SubCategoryName: values.subCategoryName,
      },
      signal,
    },
  )
  return isCategoryMutationConfirmed(response.data)
}

export const updateSubcategory = async (
  id: number,
  values: SubcategoryFormValues,
  signal: AbortSignal,
) => {
  idSchema.parse(id)
  const response = await api.put<unknown>(
    '/SubCategory/update-sub-category',
    null,
    {
      params: {
        Id: id,
        CategoryId: values.categoryId,
        SubCategoryName: values.subCategoryName,
      },
      signal,
    },
  )
  return isCategoryMutationConfirmed(response.data)
}

export const deleteSubcategory = async (id: number, signal: AbortSignal) => {
  idSchema.parse(id)
  const response = await api.delete<unknown>(
    '/SubCategory/delete-sub-category',
    {
      params: { id },
      signal,
    },
  )
  return isCategoryMutationConfirmed(response.data)
}
