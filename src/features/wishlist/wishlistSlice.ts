import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/features/products/productsApi'
import { readWishlistIds } from '@/features/wishlist/wishlistStorage'
import { fetchWishlistProduct } from '@/features/wishlist/fetchWishlistProduct'

type WishlistState = {
  ids: number[]
  products: Record<number, Product>
  requests: Record<
    number,
    {
      status: 'idle' | 'pending' | 'succeeded' | 'failed' | 'unavailable'
      error: string | null
      requestId: string
    }
  >
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: (): WishlistState => ({
    ids: readWishlistIds(),
    products: {},
    requests: {},
  }),
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload
      if (state.ids.includes(product.id)) {
        state.ids = state.ids.filter((id) => id !== product.id)
      } else {
        state.ids.push(product.id)
        state.products[product.id] = product
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistProduct.pending, (state, action) => {
        state.requests[action.meta.arg.id] = {
          status: 'pending',
          error: null,
          requestId: action.meta.requestId,
        }
      })
      .addCase(fetchWishlistProduct.fulfilled, (state, action) => {
        const id = action.meta.arg.id
        const request = state.requests[id]
        if (request?.requestId !== action.meta.requestId) return
        request.status = action.payload ? 'succeeded' : 'unavailable'
        if (action.payload) state.products[id] = action.payload
      })
      .addCase(fetchWishlistProduct.rejected, (state, action) => {
        const request = state.requests[action.meta.arg.id]
        if (request?.requestId !== action.meta.requestId) return
        request.status = action.meta.aborted ? 'idle' : 'failed'
        request.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load this product. Please try again.'
      })
  },
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
