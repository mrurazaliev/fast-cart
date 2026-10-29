import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import type { ProductFormValues } from './productFormSchema'
import { getCategories } from '@/features/categories/categoriesApi'
import type { Category } from '@/features/categories/categoriesApi'
import { getBrands } from '@/features/brands/brandsApi'
import type { Brand } from '@/features/brands/brandsApi'
import { getColors } from '@/features/colors/colorsApi'
import type { Color } from '@/features/colors/colorsApi'

export type ProductLookups = {
  categories: Category[]
  brands: Brand[]
  colors: Color[]
}

export const getProductLookups = async (
  signal: AbortSignal,
): Promise<ProductLookups> => {
  const [categories, brands, colors] = await Promise.all([
    getCategories(signal),
    getBrands(signal),
    getColors(signal),
  ])
  return { categories, brands, colors }
}

export const getProductParameters = (values: ProductFormValues) => ({
  ProductName: values.productName,
  Code: values.code,
  Description: values.description,
  Price: values.price,
  Quantity: values.quantity,
  BrandId: values.brandId,
  ColorId: values.colorId,
  SubCategoryId: values.subCategoryId,
  HasDiscount: values.hasDiscount,
  DiscountPrice: values.hasDiscount ? values.discountPrice : 0,
  Size: values.size,
  Weight: values.weight,
})

const mutationResponseSchema = z.object({
  statusCode: z.number().int().min(200).max(299),
  errors: z.array(z.unknown()).length(0),
})

export const isProductMutationConfirmed = (body: unknown) =>
  mutationResponseSchema.safeParse(body).success

export const isUncertainProductError = (error: unknown) =>
  error instanceof ApiError &&
  (error.status === undefined || error.status >= 500)

export const createProduct = async (
  values: ProductFormValues,
  signal: AbortSignal,
) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(getProductParameters(values)))
    data.append(key, String(value))
  for (const file of values.newImages) data.append('Images', file)
  const response = await api.post<unknown>('/Product/add-product', data, {
    signal,
    headers: { 'Content-Type': undefined },
  })
  return isProductMutationConfirmed(response.data)
}
