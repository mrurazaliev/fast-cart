import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { readAuthSession } from '@/features/auth/authSession'
import type { AuthSession } from '@/features/auth/authSession'

type AuthState = { session: AuthSession | null }

const authSlice = createSlice({
  name: 'auth',
  initialState: (): AuthState => ({ session: readAuthSession() }),
  reducers: {
    sessionStarted: (state, action: PayloadAction<AuthSession>) => {
      state.session = action.payload
    },
    loggedOut: (state) => {
      state.session = null
    },
  },
})

export const { sessionStarted, loggedOut } = authSlice.actions
export default authSlice.reducer
