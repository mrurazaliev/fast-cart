import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { productSchema } from '@/features/products/productsApi'

const detailsSchema = z.object({
  data: productSchema.omit({ image: true }).extend({
    images: z.array(z.object({ images: z.string() })),
    description: z.string().nullish(),
    brand: z.string().nullish(),
    color: z.string().nullish(),
    quantity: z.number().int().nonnegative().nullish(),
    weight: z.string().nullish(),
    size: z.string().nullish(),
    code: z.string().nullish(),
    subCategoryId: z.number().int().positive().nullish(),
  }),
})

export type ProductDetails = z.infer<typeof detailsSchema>['data'] & {
  image: string | null
}

export const parseProductId = (value: string | undefined): number | null => {
  if (!value || !/^[1-9]\d*$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null
}

export const getProductDetails = async (
  id: number,
  signal: AbortSignal,
): Promise<ProductDetails | null> => {
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
    return { ...product, images, image: images[0]?.images || null }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
