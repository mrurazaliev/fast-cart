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
import { api, configureApiSession } from '@/shared/api/client'
import authReducer, { loggedOut } from '@/features/auth/authSlice'
import { saveAuthSession } from '@/features/auth/authSession'

export const store = configureStore({
  reducer: {
    requests: requestsReducer,
    categories: categoriesReducer,
    products: productsReducer,
    catalog: catalogReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
})

let previousSession = store.getState().auth.session
let expiryTimer: ReturnType<typeof setTimeout> | undefined

const updateSession = () => {
  if (expiryTimer) clearTimeout(expiryTimer)
  const session = store.getState().auth.session
  saveAuthSession(session)
  if (session?.expiresAt !== null && session?.expiresAt !== undefined) {
    const delay = Math.max(
      0,
      Math.min(session.expiresAt - Date.now(), 2147483647),
    )
    expiryTimer = setTimeout(() => {
      if (session.expiresAt !== null && session.expiresAt <= Date.now())
        store.dispatch(loggedOut())
      else updateSession()
    }, delay)
  }
}

updateSession()
store.subscribe(() => {
  const session = store.getState().auth.session
  if (session === previousSession) return
  previousSession = session
  updateSession()
})

configureApiSession(
  () => {
    const session = store.getState().auth.session
    if (
      session?.expiresAt !== null &&
      session?.expiresAt !== undefined &&
      session.expiresAt <= Date.now()
    ) {
      store.dispatch(loggedOut())
      return null
    }
    return session?.token || null
  },
  () => store.dispatch(loggedOut()),
)

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
