import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategoryCounts } from './categoryCountsApi'
import type { CategoryCount } from './categoryCountsApi'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'

type CategoryCountsState = {
  items: CategoryCount[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  requestId: string | null
  updatedAt: string | null
}

const initialState: CategoryCountsState = {
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
  updatedAt: null,
}

export const fetchCategoryCounts = createAsyncThunk<
  { items: CategoryCount[]; updatedAt: string },
  void,
  { rejectValue: string }
>('categoryCounts/fetch', async (_, { signal, rejectWithValue }) => {
  try {
    const items = await getCategoryCounts(signal)
    return { items, updatedAt: new Date().toISOString() }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Unable to load category counts. Please try again.',
    )
  }
})

const categoryCountsSlice = createSlice({
  name: 'categoryCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => initialState)
      .addCase(sessionStarted, () => initialState)
      .addCase(fetchCategoryCounts.pending, (state, action) => {
        state.status = 'pending'
        state.items = []
        state.error = null
        state.updatedAt = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchCategoryCounts.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'succeeded'
        state.items = action.payload.items
        state.updatedAt = action.payload.updatedAt
      })
      .addCase(fetchCategoryCounts.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload ||
            'Unable to load category counts. Please try again.'
      })
  },
})

export default categoryCountsSlice.reducer
