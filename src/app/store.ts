import { configureStore } from '@reduxjs/toolkit'
import requestsReducer from '@/features/requests/requestsSlice'
import {
  requestStarted,
  requestFinished,
} from '@/features/requests/requestsSlice'
import categoriesReducer from '@/features/categories/categoriesSlice'
import catalogReducer from '@/features/products/catalogSlice'
import productsReducer from '@/features/products/productsSlice'
import wishlistReducer from '@/features/wishlist/wishlistSlice'
import { saveWishlistIds } from '@/features/wishlist/wishlistStorage'
import { api } from '@/shared/api/client'

export const store = configureStore({
  reducer: {
    requests: requestsReducer,
    categories: categoriesReducer,
    products: productsReducer,
    catalog: catalogReducer,
    wishlist: wishlistReducer,
  },
})

let previousWishlistIds = store.getState().wishlist.ids

store.subscribe(() => {
  const ids = store.getState().wishlist.ids
  if (ids === previousWishlistIds) return
  previousWishlistIds = ids
  saveWishlistIds(ids)
})

api.interceptors.request.use((config) => {
  store.dispatch(requestStarted())
  return config
})

api.interceptors.response.use(
  (response) => {
    store.dispatch(requestFinished())
    return response
  },
  (error: unknown) => {
    store.dispatch(requestFinished())
    return Promise.reject(error)
  },
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
