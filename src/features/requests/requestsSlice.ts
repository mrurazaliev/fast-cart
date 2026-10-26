import { createSlice } from '@reduxjs/toolkit'

type RequestsState = {
  pending: number
}

const initialState: RequestsState = { pending: 0 }

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    requestStarted: (state) => {
      state.pending += 1
    },
    requestFinished: (state) => {
      state.pending = Math.max(0, state.pending - 1)
    },
  },
})

export const { requestStarted, requestFinished } = requestsSlice.actions
export default requestsSlice.reducer
