import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import type { ProductFormValues } from './productFormSchema'
import {
  getProductParameters,
  isProductMutationConfirmed,
} from './productFormApi'
import type { ProductLookups } from './productFormApi'

const imageSchema = z.object({
  id: z.number().int().positive(),
  images: z.string(),
})
const detailsSchema = z.object({
  data: z.object({
    id: z.number().int().positive(),
    productName: z.string(),
    code: z.string().nullish(),
    description: z.string().nullish(),
    price: z.number().finite().nonnegative(),
    hasDiscount: z.boolean(),
    discountPrice: z.number().finite().nonnegative(),
    quantity: z.number().int().nonnegative().nullish(),
    brand: z.string().nullish(),
    color: z.string().nullish(),
    size: z.string().nullish(),
    weight: z.string().nullish(),
    subCategoryId: z.number().int().positive().nullish(),
    images: z.array(imageSchema),
  }),
})
const stockSchema = z.object({
  pageNumber: z.number().int().positive(),
  totalPage: z.number().int().nonnegative(),
  data: z.object({
    products: z.array(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().nonnegative().nullish(),
      }),
    ),
  }),
})

export type ProductImageData = z.infer<typeof imageSchema>
export type EditableProduct = {
  id: number
  values: ProductFormValues
  images: ProductImageData[]
  warnings: string[]
}

export const parseEditProductId = (
  value: string | undefined,
): number | null => {
  if (!value || !/^[1-9]\d*$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null
}

const getVerifiedStock = async (
  id: number,
  name: string,
  signal: AbortSignal,
): Promise<number | null> => {
  let page = 1
  while (true) {
    const response = await api.get<unknown>('/Product/get-products', {
      params: {
        ProductName: name.trim().toLowerCase(),
        PageNumber: page,
        PageSize: 100,
      },
      signal,
    })
    if (response.status === 204) return null
    const result = stockSchema.safeParse(response.data)
    if (!result.success || result.data.pageNumber !== page)
      throw new Error('Unable to verify current stock.')
    const product = result.data.data.products.find((item) => item.id === id)
    if (product) return product.quantity ?? null
    if (page >= result.data.totalPage) return null
    page++
  }
}

export const getEditableProduct = async (
  id: number,
  lookups: ProductLookups,
  signal: AbortSignal,
): Promise<EditableProduct | null> => {
  let response
  try {
    response = await api.get<unknown>('/Product/get-product-by-id', {
      params: { id },
      signal,
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
  if (response.status === 204) return null
  const result = detailsSchema.safeParse(response.data)
  if (!result.success || result.data.data.id !== id)
    throw new Error('Unable to read this product. Please try again.')
  const product = result.data.data
  const warnings: string[] = []
  let stock: number | null = null
  try {
    stock = await getVerifiedStock(id, product.productName, signal)
  } catch (error) {
    if (signal.aborted || (error instanceof ApiError && error.status === 401))
      throw error
    warnings.push('The current catalog stock could not be loaded.')
  }
  if (stock === null)
    warnings.push(
      'Stock is unverified. Enter the intended quantity explicitly before saving; the details quantity has not been used.',
    )
  else if (stock !== product.quantity)
    warnings.push(
      `Stock differs between responses. The form uses the verified catalog quantity (${stock}), not the details quantity (${product.quantity ?? 'unknown'}).`,
    )
  const brands = lookups.brands.filter(
    (item) =>
      item.brandName.trim().toLowerCase() ===
      product.brand?.trim().toLowerCase(),
  )
  const colors = lookups.colors.filter(
    (item) =>
      item.colorName.trim().toLowerCase() ===
      product.color?.trim().toLowerCase(),
  )
  const categories = lookups.categories.filter((item) =>
    item.subCategories.some((sub) => sub.id === product.subCategoryId),
  )
  if (brands.length !== 1)
    warnings.push(
      `Brand "${product.brand || 'unknown'}" has no unique match. Choose a brand explicitly.`,
    )
  if (colors.length !== 1)
    warnings.push(
      `Color "${product.color || 'unknown'}" has no unique match. Choose a color explicitly.`,
    )
  if (categories.length !== 1)
    warnings.push(
      'The subcategory has no unique category match. Choose the category and subcategory explicitly.',
    )
  return {
    id,
    images: product.images,
    warnings,
    values: {
      productName: product.productName,
      code: product.code || '',
      description: product.description || '',
      price: product.price,
      quantity: stock ?? Number.NaN,
      hasDiscount: product.hasDiscount,
      discountPrice: product.hasDiscount ? product.discountPrice : null,
      size: product.size || '',
      weight: product.weight || '',
      brandId: brands.length === 1 ? brands[0]!.id : 0,
      colorId: colors.length === 1 ? colors[0]!.id : 0,
      categoryId: categories.length === 1 ? categories[0]!.id : 0,
      subCategoryId: categories.length === 1 ? product.subCategoryId! : 0,
      newImages: [],
    },
  }
}

export const updateProduct = async (
  id: number,
  values: ProductFormValues,
  signal: AbortSignal,
) => {
  const response = await api.put<unknown>('/Product/update-product', null, {
    params: { Id: id, ...getProductParameters(values) },
    signal,
  })
  return isProductMutationConfirmed(response.data)
}

export const addProductImages = async (
  id: number,
  files: File[],
  signal: AbortSignal,
) => {
  const data = new FormData()
  data.append('ProductId', String(id))
  for (const file of files) data.append('Files', file)
  const response = await api.post<unknown>(
    '/Product/add-image-to-product',
    data,
    { signal, headers: { 'Content-Type': undefined } },
  )
  return isProductMutationConfirmed(response.data)
}

export const deleteProductImage = async (
  imageId: number,
  signal: AbortSignal,
) => {
  const response = await api.delete<unknown>(
    '/Product/delete-image-from-product',
    { params: { imageId }, signal },
  )
  return isProductMutationConfirmed(response.data)
}

export const saveProductChanges = async (
  id: number,
  values: ProductFormValues,
  imageIds: number[],
  signal: AbortSignal,
  onFieldsSaved: () => void,
) => {
  const confirmed = await updateProduct(id, values, signal)
  if (!confirmed)
    return {
      status: 'unconfirmed' as const,
      message:
        'The update response could not be confirmed. Check the product before saving again.',
    }
  onFieldsSaved()
  let uploaded = 0
  let deleted = 0
  try {
    if (signal.aborted)
      throw new Error(
        'Image changes stopped because the request or session ended.',
      )
    if (values.newImages.length) {
      if (!(await addProductImages(id, values.newImages, signal)))
        throw new Error('The image upload response could not be confirmed.')
      uploaded = values.newImages.length
    }
    for (const imageId of imageIds) {
      if (signal.aborted)
        throw new Error(
          'Image changes stopped because the request or session ended.',
        )
      if (!(await deleteProductImage(imageId, signal)))
        throw new Error('An image removal response could not be confirmed.')
      deleted++
    }
    return { status: 'saved' as const, message: 'Product updated' }
  } catch (error) {
    return {
      status: 'partial' as const,
      message: `Product fields were saved. Confirmed image uploads: ${uploaded}; removals: ${deleted}. Remaining image changes were not confirmed. Reload this product before retrying. ${error instanceof Error ? error.message : ''}`,
    }
  }
}
