import { configureStore } from '@reduxjs/toolkit'
import requestsReducer from '@/features/requests/requestsSlice'
import {
  requestStarted,
  requestFinished,
} from '@/features/requests/requestsSlice'
import authReducer, { loggedOut } from '@/features/auth/authSlice'
import { saveAuthSession } from '@/features/auth/authSession'
import { api, configureApiSession } from '@/shared/api/client'
import adminAccessReducer from '@/features/auth/adminAccessSlice'
import productsReducer from '@/features/products/productsSlice'
import categoriesReducer from '@/features/categories/categoriesSlice'
import brandsReducer from '@/features/brands/brandsSlice'
import colorsReducer from '@/features/colors/colorsSlice'

export const store = configureStore({
  reducer: {
    requests: requestsReducer,
    auth: authReducer,
    adminAccess: adminAccessReducer,
    products: productsReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    colors: colorsReducer,
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
