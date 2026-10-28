import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { Product } from '@/features/products/productsApi'
import {
  getProductDetails,
  getProductStock,
} from '@/features/products/productDetailsApi'

export const fetchWishlistProduct = createAsyncThunk<
  Product | null,
  { id: number; retry?: boolean },
  { state: RootState; rejectValue: string }
>(
  'wishlist/fetchProduct',
  async ({ id }, { getState, signal, rejectWithValue }) => {
    const state = getState()
    const existing =
      state.products.items.find((product) => product.id === id) ||
      state.catalog.items.find((product) => product.id === id)
    if (existing) return existing
    try {
      const product = await getProductDetails(id, signal)
      if (!product) return null
      const quantity = await getProductStock(id, product.productName, signal)
      if (quantity === null)
        throw new Error('Availability could not be verified. Please try again.')
      return { ...product, quantity }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Unable to load this product. Please try again.',
      )
    }
  },
  {
    condition: ({ id, retry }, { getState }) => {
      const { wishlist } = getState()
      if (!wishlist.ids.includes(id) || wishlist.products[id]) return false
      const status = wishlist.requests[id]?.status
      return (
        !status || status === 'idle' || (retry === true && status !== 'pending')
      )
    },
  },
)
