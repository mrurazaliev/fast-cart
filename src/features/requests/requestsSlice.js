import { createSlice } from '@reduxjs/toolkit'

const requestsSlice = createSlice({
  name: 'requests',
  initialState: { pending: 0 },
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
