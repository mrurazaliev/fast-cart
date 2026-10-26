import { configureStore } from '@reduxjs/toolkit'
import requestsReducer from '@/features/requests/requestsSlice'

export const store = configureStore({ reducer: { requests: requestsReducer } })
