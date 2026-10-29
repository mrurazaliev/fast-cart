import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCatalogProducts } from '@/features/products/catalogApi'
import type { CatalogQuery } from '@/features/products/catalogApi'
import type { Product } from '@/features/products/productsApi'

type CatalogState = {
  items: Product[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  requestId: string | null
  queryKey: string
  pageNumber: number
  totalPage: number
  totalRecord: number
  priceBounds: { minPrice: number; maxPrice: number } | null
}

const initialState: CatalogState = {
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
  queryKey: '',
  pageNumber: 1,
  totalPage: 0,
  totalRecord: 0,
  priceBounds: null,
}

export const fetchCatalog = createAsyncThunk(
  'catalog/fetch',
  async (query: CatalogQuery, { signal, rejectWithValue }) => {
    try {
      return await getCatalogProducts(query, signal)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Unable to load products. Please try again.',
      )
    }
  },
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state, action) => {
        state.status = 'pending'
        state.error = null
        state.items = []
        state.priceBounds = null
        state.requestId = action.meta.requestId
        state.queryKey = JSON.stringify(action.meta.arg)
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'succeeded'
        state.items = action.payload.data.products
        state.pageNumber = action.payload.pageNumber
        state.totalPage = action.payload.totalPage
        state.totalRecord = action.payload.totalRecord
        state.priceBounds = action.payload.data.minMaxPrice || null
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : String(
              action.payload || 'Unable to load products. Please try again.',
            )
      })
  },
})

export default catalogSlice.reducer
