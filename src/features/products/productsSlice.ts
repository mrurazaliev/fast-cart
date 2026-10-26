import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { getProducts } from '@/features/products/productsApi'
import type { Product } from '@/features/products/productsApi'

type ProductsState = {
  items: Product[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = { items: [], status: 'idle', error: null }

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState; rejectValue: string }
>(
  'products/fetchProducts',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getProducts(signal)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Unable to load products. Please try again.',
      )
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().products
      return status !== 'pending' && status !== 'succeeded'
    },
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload || 'Unable to load products. Please try again.'
      })
  },
})

export default productsSlice.reducer
