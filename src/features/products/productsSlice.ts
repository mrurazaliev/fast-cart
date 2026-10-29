import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getProducts } from './productsApi'
import type { Product, ProductsPage, ProductsQuery } from './productsApi'
import { ApiError } from '@/shared/api/types'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'

type ProductsState = {
  items: Product[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  errorStatus: number | null
  queryKey: string
  requestId: string | null
  pageNumber: number
  totalPage: number
  totalRecord: number
  saveNotice: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  errorStatus: null,
  queryKey: '',
  requestId: null,
  pageNumber: 1,
  totalPage: 0,
  totalRecord: 0,
  saveNotice: null,
}

export const fetchProducts = createAsyncThunk<
  ProductsPage,
  ProductsQuery,
  { rejectValue: { message: string; status: number | null } }
>('products/fetch', async (query, { signal, rejectWithValue }) => {
  try {
    return await getProducts(query, signal)
  } catch (error) {
    const status = error instanceof ApiError ? error.status || null : null
    let message =
      error instanceof Error
        ? error.message
        : 'Unable to load products. Please try again.'
    if (status === 401) message = 'Please sign in again to view products.'
    if (status === 403) message = 'You do not have permission to view products.'
    return rejectWithValue({ message, status })
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productsInvalidated: () => ({ ...initialState }),
    productSaveNoticeSet: (state, action: PayloadAction<string | null>) => {
      state.saveNotice = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, (state) => ({
        ...initialState,
        saveNotice: state.saveNotice,
      }))
      .addCase(sessionStarted, (state) => ({
        ...initialState,
        saveNotice: state.saveNotice,
      }))
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'pending'
        state.items = []
        state.error = null
        state.errorStatus = null
        state.totalRecord = 0
        state.totalPage = 0
        state.queryKey = JSON.stringify(action.meta.arg)
        state.requestId = action.meta.requestId
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'succeeded'
        state.items = action.payload.data.products
        state.pageNumber = action.payload.pageNumber
        state.totalPage = action.payload.totalPage
        state.totalRecord = action.payload.totalRecord
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload?.message ||
            'Unable to load products. Please try again.'
        state.errorStatus = action.meta.aborted
          ? null
          : action.payload?.status || null
      })
  },
})

export const { productsInvalidated, productSaveNoticeSet } =
  productsSlice.actions
export default productsSlice.reducer
