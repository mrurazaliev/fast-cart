import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { getAuthErrors } from '@/features/auth/authApi'
import type { CategoryFormValues } from './categoryFormSchema'

export const categorySchema = z.object({
  id: z.number().int().positive().max(2147483647),
  categoryName: z.string(),
  categoryImage: z.string().nullish(),
  subCategories: z.array(
    z.object({
      id: z.number().int().positive().max(2147483647),
      subCategoryName: z.string(),
    }),
  ),
})
export type Category = z.infer<typeof categorySchema>
const responseSchema = z.object({ data: z.array(categorySchema) })
const mutationSchema = z.object({
  statusCode: z.number().int().min(200).max(299),
  errors: z.array(z.unknown()).length(0),
})
export const isCategoryMutationConfirmed = (body: unknown) =>
  mutationSchema.safeParse(body).success

export const getCategoryError = (error: unknown) => {
  const message = getAuthErrors(error).message
  if (error instanceof ApiError && error.status === 401)
    return 'Please sign in again to manage categories.'
  if (error instanceof ApiError && error.status === 403)
    return `You do not have permission for this action. ${message}`
  return message
}

export const getCategories = async (
  signal: AbortSignal,
): Promise<Category[]> => {
  const response = await api.get<unknown>('/Category/get-categories', {
    signal,
  })
  if (response.status === 204) return []
  const result = responseSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to read categories and subcategories.')
  return result.data.data
}

export const getCategory = async (id: number, signal: AbortSignal) => {
  const response = await api.get<unknown>('/Category/get-category-by-id', {
    params: { id },
    signal,
  })
  const result = z.object({ data: categorySchema }).safeParse(response.data)
  if (!result.success || result.data.data.id !== id)
    throw new Error(
      'Unable to read this category. Reload the list before editing.',
    )
  return result.data.data
}

export const createCategory = async (
  values: CategoryFormValues,
  signal: AbortSignal,
) => {
  const data = new FormData()
  if (!values.categoryImage) throw new Error('Choose a new category image.')
  data.append('CategoryName', values.categoryName)
  data.append('CategoryImage', values.categoryImage)
  const response = await api.post<unknown>('/Category/add-category', data, {
    signal,
    headers: { 'Content-Type': undefined },
  })
  return isCategoryMutationConfirmed(response.data)
}

export const updateCategory = async (
  id: number,
  values: CategoryFormValues,
  signal: AbortSignal,
) => {
  const data = new FormData()
  if (!values.categoryImage) throw new Error('Choose a new category image.')
  data.append('Id', String(id))
  data.append('CategoryName', values.categoryName)
  data.append('CategoryImage', values.categoryImage)
  const response = await api.put<unknown>('/Category/update-category', data, {
    signal,
    headers: { 'Content-Type': undefined },
  })
  return isCategoryMutationConfirmed(response.data)
}

export const deleteCategory = async (id: number, signal: AbortSignal) => {
  const response = await api.delete<unknown>('/Category/delete-category', {
    params: { id },
    signal,
  })
  return isCategoryMutationConfirmed(response.data)
}
