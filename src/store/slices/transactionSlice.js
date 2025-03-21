import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../service/jwtAxios'; // Import your axios instance

// Define the async thunk for fetching transactions
export const getTransaction = createAsyncThunk(
  'transactions/getTransaction',
  async ({ currentPage, pageSize, typeFilter, statusFilter }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
      };

      const bodyData = { typeFilter, statusFilter };
      const response = await jwtAxios.post(
        `/transactions/getTransactions?page=${currentPage}&pageSize=${pageSize}`,
        bodyData,
        config
      );

      return response.data; // Return the data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Create the slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    totalTransactionsCount: 0,
    currentPage: 1,
    pageSize: 3,
    transactionLoading: false,
    error: null,
  },
  reducers: {
    clearTransactions(state) {
      state.transactions = [];
      state.transactionLoading = false;
      state.totalTransactionsCount = 0; // Reset total count if needed
      state.currentPage = 1; // Optionally reset the page to 1
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransaction.pending, (state) => {
        state.transactionLoading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.transactionLoading = false;
        state.transactions = action.payload.transactions || [];
        state.totalTransactionsCount = action.payload.totalTransactionsCount || 0;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.transactionLoading = false;
        state.error = action.payload; // Store error message
      });
  }
});

// Export actions and reducer
export const selectTransactions = (state) => state.transactions.transactions;
export const selectTotalCount = (state) => state.transactions.totalTransactionsCount;
export const selectLoading = (state) => state.transactions.transactionLoading;
export const { setCurrentPage, setPageSize, clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
