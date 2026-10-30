import { z } from 'zod'
import { api } from '@/shared/api/client'
import { getCategories } from '@/features/categories/categoriesApi'
import type { Category } from '@/features/categories/categoriesApi'
import { getBrands } from '@/features/brands/brandsApi'
import type { Brand } from '@/features/brands/brandsApi'

const productSchema = z.object({
  id: z.number().int().positive().max(2147483647),
  productName: z.string(),
  image: z.string().nullish(),
  price: z.number().finite().nonnegative(),
  quantity: z.number().int().nonnegative().nullish(),
  categoryId: z.number().int().nonnegative().nullish(),
  categoryName: z.string().nullish(),
})
const pageSchema = z.object({
  pageNumber: z.number().int().positive(),
  totalPage: z.number().int().nonnegative(),
  totalRecord: z.number().int().nonnegative(),
  data: z.object({ products: z.array(productSchema) }),
})

export type DashboardProduct = z.infer<typeof productSchema>
export type CategoryDistribution = {
  id: number | null
  name: string
  count: number
}
export type DashboardData = {
  products: DashboardProduct[]
  categories: Category[]
  brands: Brand[]
  totalProducts: number
  distribution: CategoryDistribution[]
  stock: { available: number; outOfStock: number; unknown: number }
}

export const getDashboardProducts = async (signal: AbortSignal) => {
  const products = new Map<number, DashboardProduct>()
  let page = 1
  let totalProducts: number | null = null
  let totalPages: number | null = null
  while (true) {
    signal.throwIfAborted()
    const response = await api.get<unknown>('/Product/get-products', {
      params: { PageNumber: page, PageSize: 100 },
      signal,
    })
    if (response.status === 204) {
      if (page === 1) return { products: [], totalProducts: 0 }
      throw new Error(
        'The complete catalog could not be loaded. Please try again.',
      )
    }
    const result = pageSchema.safeParse(response.data)
    if (!result.success || result.data.pageNumber !== page)
      throw new Error('Unable to read the catalog overview.')
    const current = result.data
    if (totalProducts === null) {
      totalProducts = current.totalRecord
      totalPages = current.totalPage
    } else if (
      current.totalRecord !== totalProducts ||
      current.totalPage !== totalPages
    )
      throw new Error('The catalog changed while loading. Please try again.')
    const previousCount = products.size
    for (const product of current.data.products)
      products.set(product.id, product)
    if (products.size > totalProducts)
      throw new Error(
        'The catalog totals could not be verified. Please try again.',
      )
    if (products.size === totalProducts)
      return { products: [...products.values()], totalProducts }
    if (page >= current.totalPage || products.size === previousCount)
      throw new Error(
        'The complete catalog could not be loaded. Please try again.',
      )
    page++
  }
}

export const getCategoryDistribution = (
  products: DashboardProduct[],
  categories: Category[],
) => {
  const groups = new Map<number | null, CategoryDistribution>()
  for (const product of products) {
    const id =
      product.categoryId && product.categoryId > 0 ? product.categoryId : null
    const category = categories.find((item) => item.id === id)
    const name =
      id === null
        ? 'Category unavailable'
        : category?.categoryName ||
          product.categoryName?.trim() ||
          `Category #${id}`
    const current = groups.get(id)
    if (current) current.count++
    else groups.set(id, { id, name, count: 1 })
  }
  return [...groups.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  )
}

export const getDashboard = async (
  signal: AbortSignal,
): Promise<DashboardData> => {
  const [catalog, categories, brands] = await Promise.all([
    getDashboardProducts(signal),
    getCategories(signal),
    getBrands(signal),
  ])
  if (
    new Set(categories.map((category) => category.id)).size !==
    categories.length
  )
    throw new Error(
      'The category totals could not be verified. Please try again.',
    )
  const stock = { available: 0, outOfStock: 0, unknown: 0 }
  for (const product of catalog.products) {
    if (product.quantity === null || product.quantity === undefined)
      stock.unknown++
    else if (product.quantity === 0) stock.outOfStock++
    else stock.available++
  }
  return {
    ...catalog,
    categories,
    brands,
    distribution: getCategoryDistribution(catalog.products, categories),
    stock,
  }
}
