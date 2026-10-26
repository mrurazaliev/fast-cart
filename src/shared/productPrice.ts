import type { Product } from '@/features/products/productsApi'

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPrice = (price: number) => priceFormatter.format(price)

export const hasValidDiscount = (product: Product) =>
  product.hasDiscount &&
  product.price > 0 &&
  product.discountPrice > 0 &&
  product.discountPrice < product.price
