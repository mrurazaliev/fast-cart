import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProductDetails } from '@/features/products/productDetailsApi'
import type { ProductDetails } from '@/features/products/productDetailsApi'

type ProductDetailsState = {
  item: ProductDetails | null
  productId: number | null
  requestId: string | null
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductDetailsState = {
  item: null,
  productId: null,
  requestId: null,
  status: 'idle',
  error: null,
}

export const fetchProductDetails = createAsyncThunk<
  ProductDetails | null,
  number,
  { rejectValue: string }
>('productDetails/fetch', async (id, { signal, rejectWithValue }) => {
  try {
    return await getProductDetails(id, signal)
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Unable to load this product. Please try again.',
    )
  }
})

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.productId = action.meta.arg
        state.requestId = action.meta.requestId
        state.item = null
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.item = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load this product. Please try again.'
      })
  },
})

export default productDetailsSlice.reducer
