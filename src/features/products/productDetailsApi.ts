import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { productSchema } from '@/features/products/productsApi'
import type { Product } from '@/features/products/productsApi'

const detailsSchema = z.object({
  data: productSchema.omit({ image: true }).extend({
    images: z.array(z.object({ images: z.string() })),
  }),
})

export const getProductDetails = async (
  id: number,
  signal: AbortSignal,
): Promise<Product | null> => {
  try {
    const response = await api.get<unknown>('/Product/get-product-by-id', {
      params: { id },
      signal,
    })
    if (response.status === 204) return null
    const result = detailsSchema.safeParse(response.data)
    if (!result.success || result.data.data.id !== id)
      throw new Error('Unable to read this product. Please try again.')
    const { images, ...product } = result.data.data
    return { ...product, image: images[0]?.images || null }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
