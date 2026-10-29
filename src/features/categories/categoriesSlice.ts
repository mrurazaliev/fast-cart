import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'
import { getCategories, getCategoryError } from './categoriesApi'
import type { Category } from './categoriesApi'

type CategoriesState = {
  items: Category[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  requestId: string | null
}
const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
}

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('categories/fetch', async (_, { signal, rejectWithValue }) => {
  try {
    return await getCategories(signal)
  } catch (error) {
    return rejectWithValue(getCategoryError(error))
  }
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: { categoriesInvalidated: () => ({ ...initialState }) },
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => ({ ...initialState }))
      .addCase(sessionStarted, () => ({ ...initialState }))
      .addCase(fetchCategories.pending, (state, action) => {
        state.status = 'pending'
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load categories.'
      })
  },
})
export const { categoriesInvalidated } = categoriesSlice.actions
export default categoriesSlice.reducer
