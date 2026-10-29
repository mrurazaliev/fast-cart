import { z } from 'zod'
import { api } from '@/shared/api/client'
import { productSchema } from '@/features/products/productsApi'

export type CatalogQuery = {
  ProductName?: string
  CategoryId?: number
  SubcategoryId?: number
  MinPrice?: number
  MaxPrice?: number
  PageNumber: number
}

export const readCatalogQuery = (params: URLSearchParams): CatalogQuery => {
  const positiveInteger = (name: string) => {
    const value = Number(params.get(name))
    return Number.isSafeInteger(value) && value > 0 ? value : undefined
  }
  const readPrice = (name: string) => {
    const raw = params.get(name)?.trim()
    if (!raw) return undefined
    const value = Number(raw)
    return Number.isFinite(value) && value >= 0 ? value : undefined
  }
  const minPrice = readPrice('MinPrice')
  const maxPrice = readPrice('MaxPrice')
  const validRange =
    minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice
  return {
    ProductName: params.get('ProductName')?.trim() || undefined,
    CategoryId: positiveInteger('CategoryId'),
    SubcategoryId: positiveInteger('SubcategoryId'),
    ...(validRange && minPrice !== undefined ? { MinPrice: minPrice } : {}),
    ...(validRange && maxPrice !== undefined && maxPrice > 0
      ? { MaxPrice: maxPrice }
      : {}),
    PageNumber: positiveInteger('PageNumber') || 1,
  }
}

const catalogSchema = z.object({
  pageNumber: z.number().int().positive(),
  totalPage: z.number().int().nonnegative(),
  totalRecord: z.number().int().nonnegative(),
  data: z.object({
    products: z.array(productSchema),
    minMaxPrice: z
      .object({
        minPrice: z.number().finite().nonnegative(),
        maxPrice: z.number().finite().nonnegative(),
      })
      .refine((range) => range.minPrice <= range.maxPrice)
      .nullish(),
  }),
})

export const getCatalogProducts = async (
  query: CatalogQuery,
  signal: AbortSignal,
) => {
  const response = await api.get<unknown>('/Product/get-products', {
    params: {
      ...query,
      ProductName: query.ProductName?.toLowerCase(),
      PageSize: 12,
    },
    signal,
  })
  if (response.status === 204)
    return {
      pageNumber: query.PageNumber,
      totalPage: 0,
      totalRecord: 0,
      data: { products: [] },
    }
  const result = catalogSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to read products. Please try again.')
  return result.data
}
