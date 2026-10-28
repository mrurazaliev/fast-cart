import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getProductDetails,
  getProductStock,
} from '@/features/products/productDetailsApi'
import type { ProductDetails } from '@/features/products/productDetailsApi'

type ProductDetailsState = {
  item: ProductDetails | null
  productId: number | null
  requestId: string | null
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  stock: number | null
  stockError: string | null
}

const initialState: ProductDetailsState = {
  item: null,
  productId: null,
  requestId: null,
  status: 'idle',
  error: null,
  stock: null,
  stockError: null,
}

export const fetchProductDetails = createAsyncThunk<
  {
    product: ProductDetails | null
    stock: number | null
    stockError: string | null
  },
  number,
  { rejectValue: string }
>('productDetails/fetch', async (id, { signal, rejectWithValue }) => {
  try {
    const product = await getProductDetails(id, signal)
    if (!product) return { product: null, stock: null, stockError: null }
    try {
      const stock = await getProductStock(id, product.productName, signal)
      return {
        product,
        stock,
        stockError:
          stock === null
            ? 'Availability could not be verified. Please try again.'
            : null,
      }
    } catch (error) {
      if (signal.aborted) throw error
      return {
        product,
        stock: null,
        stockError:
          error instanceof Error
            ? error.message
            : 'Unable to verify availability. Please try again.',
      }
    }
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
        state.stock = null
        state.stockError = null
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.item = action.payload.product
        state.stock = action.payload.stock
        state.stockError = action.payload.stockError
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
