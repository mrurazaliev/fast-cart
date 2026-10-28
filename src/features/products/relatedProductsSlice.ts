import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCatalogProducts } from '@/features/products/catalogApi'
import type { Product } from '@/features/products/productsApi'

type RelatedQuery = { productId: number; subcategoryId: number }
type RelatedState = {
  items: Product[]
  productId: number | null
  subcategoryId: number | null
  requestId: string | null
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: RelatedState = {
  items: [],
  productId: null,
  subcategoryId: null,
  requestId: null,
  status: 'idle',
  error: null,
}

export const fetchRelatedProducts = createAsyncThunk<
  Product[],
  RelatedQuery,
  { rejectValue: string }
>(
  'relatedProducts/fetch',
  async ({ productId, subcategoryId }, { signal, rejectWithValue }) => {
    try {
      const result = await getCatalogProducts(
        { SubcategoryId: subcategoryId, PageNumber: 1 },
        signal,
      )
      return result.data.products
        .filter((product) => product.id !== productId)
        .slice(0, 4)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Unable to load related products. Please try again.',
      )
    }
  },
)

const relatedProductsSlice = createSlice({
  name: 'relatedProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedProducts.pending, (state, action) => {
        state.items = []
        state.productId = action.meta.arg.productId
        state.subcategoryId = action.meta.arg.subcategoryId
        state.requestId = action.meta.requestId
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload ||
            'Unable to load related products. Please try again.'
      })
  },
})

export default relatedProductsSlice.reducer
