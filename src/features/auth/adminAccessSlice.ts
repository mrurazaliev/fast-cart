import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminAccess } from './adminAccessApi'
import { loggedOut, sessionStarted } from './authSlice'
import type { AuthSession } from './authSession'

type AccessState = {
  status: 'idle' | 'pending' | 'allowed' | 'denied' | 'failed'
  error: string | null
  requestId: string | null
}

const initialState: AccessState = {
  status: 'idle',
  error: null,
  requestId: null,
}

export const verifyAdminAccess = createAsyncThunk<
  'allowed' | 'denied',
  void,
  { state: { auth: { session: AuthSession | null } }; rejectValue: string }
>('adminAccess/verify', async (_, { getState, signal, rejectWithValue }) => {
  const session = getState().auth.session
  if (!session) return rejectWithValue('Please sign in to continue.')
  try {
    return await getAdminAccess(session.token, signal)
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Unable to confirm admin access.',
    )
  }
})

const adminAccessSlice = createSlice({
  name: 'adminAccess',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sessionStarted, () => ({ ...initialState }))
      .addCase(loggedOut, () => ({ ...initialState }))
      .addCase(verifyAdminAccess.pending, (state, action) => {
        state.status = 'pending'
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(verifyAdminAccess.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.payload
      })
      .addCase(verifyAdminAccess.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to confirm admin access.'
      })
  },
})

export default adminAccessSlice.reducer
