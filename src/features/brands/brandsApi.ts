import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { getAuthErrors } from '@/features/auth/authApi'
import { brandFormSchema } from './brandFormSchema'
import type { BrandFormValues } from './brandFormSchema'

const idSchema = z.number().int().positive().max(2147483647)
const brandSchema = z.object({ id: idSchema, brandName: z.string() })
const pageSchema = z.object({
  pageNumber: z.number().int().positive(),
  totalPage: z.number().int().nonnegative(),
  totalRecord: z.number().int().nonnegative().optional(),
  data: z.array(brandSchema),
})
const mutationSchema = z.object({
  statusCode: z.number().int().min(200).max(299),
  errors: z.array(z.unknown()).length(0),
})
export type Brand = z.infer<typeof brandSchema>

export const getBrandError = (error: unknown) => {
  const message = getAuthErrors(error).message
  if (error instanceof ApiError && error.status === 401)
    return 'Please sign in again to manage brands.'
  if (error instanceof ApiError && error.status === 403)
    return `You do not have permission for this action. ${message}`
  return message
}

export const getBrands = async (signal: AbortSignal): Promise<Brand[]> => {
  const items = new Map<number, Brand>()
  let page = 1
  while (true) {
    signal.throwIfAborted()
    const response = await api.get<unknown>('/Brand/get-brands', {
      params: { PageNumber: page, PageSize: 100 },
      signal,
    })
    if (response.status === 204) {
      if (page > 1)
        throw new Error('The brand list is incomplete. Please reload it.')
      return []
    }
    const parsed = pageSchema.safeParse(response.data)
    if (!parsed.success || parsed.data.pageNumber !== page)
      throw new Error('Unable to read brands.')
    const before = items.size
    for (const brand of parsed.data.data) items.set(brand.id, brand)
    if (
      parsed.data.totalRecord !== undefined &&
      items.size >= parsed.data.totalRecord
    )
      return [...items.values()]
    if (page >= parsed.data.totalPage) {
      if (
        parsed.data.totalRecord !== undefined &&
        items.size < parsed.data.totalRecord
      )
        throw new Error('The brand list is incomplete. Please reload it.')
      return [...items.values()]
    }
    if (items.size === before)
      throw new Error('The brand list is incomplete. Please reload it.')
    page++
  }
}

export const getBrand = async (id: number, signal: AbortSignal) => {
  idSchema.parse(id)
  const response = await api.get<unknown>('/Brand/get-brand-by-id', {
    params: { id },
    signal,
  })
  const parsed = z.object({ data: brandSchema }).safeParse(response.data)
  if (!parsed.success || parsed.data.data.id !== id)
    throw new Error(
      'Unable to read this brand. Reload the list before editing.',
    )
  return parsed.data.data
}

export const createBrand = async (
  values: BrandFormValues,
  signal: AbortSignal,
) => {
  const data = brandFormSchema.parse(values)
  const response = await api.post<unknown>('/Brand/add-brand', null, {
    params: { BrandName: data.brandName },
    signal,
  })
  return mutationSchema.safeParse(response.data).success
}
export const updateBrand = async (
  id: number,
  values: BrandFormValues,
  signal: AbortSignal,
) => {
  idSchema.parse(id)
  const data = brandFormSchema.parse(values)
  const response = await api.put<unknown>('/Brand/update-brand', null, {
    params: { Id: id, BrandName: data.brandName },
    signal,
  })
  return mutationSchema.safeParse(response.data).success
}
export const deleteBrand = async (id: number, signal: AbortSignal) => {
  idSchema.parse(id)
  const response = await api.delete<unknown>('/Brand/delete-brand', {
    params: { id },
    signal,
  })
  return mutationSchema.safeParse(response.data).success
}
