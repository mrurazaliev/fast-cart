import { getLocale } from '@/shared/i18n/i18n'
import type { Product } from '@/features/products/productsApi'

export const formatPrice = (price: number) =>
  new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

export const hasValidDiscount = (product: Product) =>
  product.hasDiscount &&
  Number.isFinite(product.price) &&
  Number.isFinite(product.discountPrice) &&
  product.price > 0 &&
  product.discountPrice > 0 &&
  product.discountPrice < product.price

export const getDiscountPercentage = (product: Product): number | null => {
  if (!hasValidDiscount(product)) return null
  const percentage = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100,
  )
  return percentage > 0 ? percentage : null
}
