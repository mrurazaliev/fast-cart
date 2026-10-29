import { z } from 'zod'
import { api } from '@/shared/api/client'

const productSchema = z.object({
  id: z.number().int().positive(),
  productName: z.string(),
  image: z.string().nullish(),
  quantity: z.number().int().nonnegative().nullish(),
  categoryName: z.string().nullish(),
  price: z.number().finite().nonnegative(),
})

const productsResponseSchema = z.object({
  pageNumber: z.number().int().positive(),
  totalPage: z.number().int().nonnegative(),
  totalRecord: z.number().int().nonnegative(),
  data: z.object({ products: z.array(productSchema) }),
})

export type Product = z.infer<typeof productSchema>
export type ProductsPage = z.infer<typeof productsResponseSchema>
export type ProductsQuery = { ProductName?: string; PageNumber: number }

export const readProductsQuery = (params: URLSearchParams): ProductsQuery => {
  const rawPage = params.get('PageNumber') || ''
  const page = Number(rawPage)
  return {
    ProductName: params.get('ProductName')?.trim() || undefined,
    PageNumber:
      /^\d+$/.test(rawPage) &&
      Number.isSafeInteger(page) &&
      page > 0 &&
      page <= 2147483647
        ? page
        : 1,
  }
}

export const getProducts = async (
  query: ProductsQuery,
  signal: AbortSignal,
): Promise<ProductsPage> => {
  const response = await api.get<unknown>('/Product/get-products', {
    params: {
      ProductName: query.ProductName?.toLowerCase(),
      PageNumber: query.PageNumber,
      PageSize: 8,
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
  const result = productsResponseSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to read products. Please try again.')
  return result.data
}
