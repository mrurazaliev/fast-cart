import { configureStore } from '@reduxjs/toolkit'
import requestsReducer from '@/features/requests/requestsSlice'
import {
  requestStarted,
  requestFinished,
} from '@/features/requests/requestsSlice'
import categoriesReducer from '@/features/categories/categoriesSlice'
import { api } from '@/shared/api/client'

export const store = configureStore({
  reducer: { requests: requestsReducer, categories: categoriesReducer },
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
