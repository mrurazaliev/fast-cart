import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { hasValidDiscount } from '@/shared/productPrice'

export const selectHomeProducts = createSelector(
  [(state: RootState) => state.products.items],
  (products) => {
    const flashIds = new Set(
      products
        .filter(hasValidDiscount)
        .slice(0, 12)
        .map((product) => product.id),
    )
    const ordered = [...products].sort((first, second) => first.id - second.id)
    const selection = [
      ...ordered.filter((product) => !flashIds.has(product.id)),
      ...ordered.filter((product) => flashIds.has(product.id)),
    ]

    return {
      bestSelling: selection.slice(0, 4),
      explore: selection.slice(4, 12),
    }
  },
)
