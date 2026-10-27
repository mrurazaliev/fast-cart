import { z } from 'zod'
import { api } from '@/shared/api/client'

export const productSchema = z.object({
  id: z.number(),
  productName: z.string(),
  image: z.string().nullable(),
  price: z.number().nonnegative(),
  hasDiscount: z.boolean(),
  discountPrice: z.number().nonnegative(),
})

const productsResponseSchema = z.object({
  data: z.object({ products: z.array(productSchema) }),
})

export type Product = z.infer<typeof productSchema>

export const getProducts = async (signal: AbortSignal): Promise<Product[]> => {
  const response = await api.get<unknown>('/Product/get-products', {
    params: { PageNumber: 1, PageSize: 100 },
    signal,
  })
  const result = productsResponseSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to read products. Please try again.')
  return result.data.data.products
}
