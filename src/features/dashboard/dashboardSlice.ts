import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'
import { getAuthErrors } from '@/features/auth/authApi'
import { ApiError } from '@/shared/api/types'
import { getDashboard } from './dashboardApi'
import type { DashboardData } from './dashboardApi'

type DashboardState = {
  data: DashboardData | null
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  requestId: string | null
}
const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
  requestId: null,
}
export const fetchDashboard = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>('dashboard/fetch', async (_, { signal, rejectWithValue }) => {
  try {
    return await getDashboard(signal)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401)
      return rejectWithValue('Please sign in again to view the dashboard.')
    if (error instanceof ApiError && error.status === 403)
      return rejectWithValue(
        'You do not have permission to view this catalog overview.',
      )
    return rejectWithValue(getAuthErrors(error).message)
  }
})
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => ({ ...initialState }))
      .addCase(sessionStarted, () => ({ ...initialState }))
      .addCase(fetchDashboard.pending, (state, action) => {
        state.status = 'pending'
        state.data = null
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load the dashboard.'
      })
  },
})
export default dashboardSlice.reducer
