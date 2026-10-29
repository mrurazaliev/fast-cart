import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'
import { getBrands, getBrandError } from './brandsApi'
import type { Brand } from './brandsApi'

type BrandsState = {
  items: Brand[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  requestId: string | null
}
const initialState: BrandsState = {
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
}
export const fetchBrands = createAsyncThunk<
  Brand[],
  void,
  { rejectValue: string }
>('brands/fetch', async (_, { signal, rejectWithValue }) => {
  try {
    return await getBrands(signal)
  } catch (error) {
    return rejectWithValue(getBrandError(error))
  }
})
const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => ({ ...initialState }))
      .addCase(sessionStarted, () => ({ ...initialState }))
      .addCase(fetchBrands.pending, (state, action) => {
        state.status = 'pending'
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load brands.'
      })
  },
})
export default brandsSlice.reducer
