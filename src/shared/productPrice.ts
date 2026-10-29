import type { Product } from '@/features/products/productsApi'

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPrice = (price: number) => priceFormatter.format(price)

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
