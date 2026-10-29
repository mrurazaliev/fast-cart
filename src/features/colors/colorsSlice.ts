import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'
import { getColors, getColorError } from './colorsApi'
import type { Color } from './colorsApi'

type ColorsState = {
  items: Color[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  requestId: string | null
}
const initialState: ColorsState = {
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
}
export const fetchColors = createAsyncThunk<
  Color[],
  void,
  { rejectValue: string }
>('colors/fetch', async (_, { signal, rejectWithValue }) => {
  try {
    return await getColors(signal)
  } catch (error) {
    return rejectWithValue(getColorError(error))
  }
})
const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => ({ ...initialState }))
      .addCase(sessionStarted, () => ({ ...initialState }))
      .addCase(fetchColors.pending, (state, action) => {
        state.status = 'pending'
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchColors.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load colors.'
      })
  },
})
export default colorsSlice.reducer
