import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { getAuthErrors } from '@/features/auth/authApi'
export type ColorValues = { colorName: string }

const idSchema = z.number().int().positive().max(2147483647)
const colorSchema = z.object({ id: idSchema, colorName: z.string() })
const colorsSchema = z.object({
  pageNumber: z.number().int().positive(),
  totalPage: z.number().int().nonnegative(),
  totalRecord: z.number().int().nonnegative().optional(),
  data: z.array(colorSchema),
})
const mutationSchema = z.object({
  statusCode: z.number().int().min(200).max(299),
  errors: z.array(z.unknown()).length(0),
})
export type Color = z.infer<typeof colorSchema>

export const getColorError = (error: unknown) => {
  const message = getAuthErrors(error).message
  if (error instanceof ApiError && error.status === 401)
    return 'Please sign in again to manage colors.'
  if (error instanceof ApiError && error.status === 403)
    return `You do not have permission for this action. ${message}`
  return message
}

export const getColors = async (signal: AbortSignal): Promise<Color[]> => {
  const items = new Map<number, Color>()
  let page = 1
  while (true) {
    signal.throwIfAborted()
    const response = await api.get<unknown>('/Color/get-colors', {
      params: { PageNumber: page, PageSize: 100 },
      signal,
    })
    if (response.status === 204) {
      if (page === 1) return []
      throw new Error('The complete color list could not be loaded.')
    }
    const result = colorsSchema.safeParse(response.data)
    if (!result.success || result.data.pageNumber !== page)
      throw new Error('Unable to read colors.')
    const previousCount = items.size
    for (const color of result.data.data) items.set(color.id, color)
    if (
      result.data.totalRecord !== undefined &&
      items.size >= result.data.totalRecord
    )
      return [...items.values()]
    if (page >= result.data.totalPage) {
      if (
        result.data.totalRecord !== undefined &&
        items.size < result.data.totalRecord
      )
        throw new Error('The complete color list could not be loaded.')
      return [...items.values()]
    }
    if (items.size === previousCount)
      throw new Error('The complete color list could not be loaded.')
    page++
  }
}

export const getColor = async (id: number, signal: AbortSignal) => {
  idSchema.parse(id)
  const response = await api.get<unknown>('/Color/get-color-by-id', {
    params: { id },
    signal,
  })
  const result = z.object({ data: colorSchema }).safeParse(response.data)
  if (!result.success || result.data.data.id !== id)
    throw new Error(
      'Unable to read this color. Reload the list before editing.',
    )
  return result.data.data
}

export const createColor = async (values: ColorValues, signal: AbortSignal) => {
  const response = await api.post<unknown>('/Color/add-color', null, {
    params: { ColorName: values.colorName },
    signal,
  })
  return mutationSchema.safeParse(response.data).success
}

export const updateColor = async (
  id: number,
  values: ColorValues,
  signal: AbortSignal,
) => {
  idSchema.parse(id)
  const response = await api.put<unknown>('/Color/update-color', null, {
    params: { Id: id, ColorName: values.colorName },
    signal,
  })
  return mutationSchema.safeParse(response.data).success
}

export const deleteColor = async (id: number, signal: AbortSignal) => {
  idSchema.parse(id)
  const response = await api.delete<unknown>('/Color/delete-color', {
    params: { id },
    signal,
  })
  return mutationSchema.safeParse(response.data).success
}
