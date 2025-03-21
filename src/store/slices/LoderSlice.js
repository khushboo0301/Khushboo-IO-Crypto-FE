import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
}

const loderSlice = createSlice({
  name: 'loder',
  initialState,
  reducers: {
    setLoginLoading: (state, action) => ({
      ...state,
      loading: action.payload,
    }),
  },
})

export const { setLoginLoading } = loderSlice.actions
export default loderSlice.reducer
