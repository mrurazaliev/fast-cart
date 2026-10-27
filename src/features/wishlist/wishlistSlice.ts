import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/features/products/productsApi'
import { readWishlistIds } from '@/features/wishlist/wishlistStorage'

type WishlistState = {
  ids: number[]
  products: Record<number, Product>
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: (): WishlistState => ({ ids: readWishlistIds(), products: {} }),
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
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
