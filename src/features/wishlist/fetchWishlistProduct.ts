import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { Product } from '@/features/products/productsApi'
import { getProductDetails } from '@/features/products/productDetailsApi'

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
      return await getProductDetails(id, signal)
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
