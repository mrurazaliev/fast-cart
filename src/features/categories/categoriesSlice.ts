import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { getCategories } from '@/features/categories/categoriesApi'
import type { Category } from '@/features/categories/categoriesApi'

type CategoriesState = {
  items: Category[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CategoriesState = { items: [], status: 'idle', error: null }

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: RootState; rejectValue: string }
>(
  'categories/fetchCategories',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getCategories(signal)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Unable to load categories. Please try again.',
      )
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().categories
      return status !== 'pending' && status !== 'succeeded'
    },
  },
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload || 'Unable to load categories. Please try again.'
      })
  },
})

export default categoriesSlice.reducer
