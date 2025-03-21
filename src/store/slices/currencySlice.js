import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail } from "./notificationSlice";
import apiConfigs from "../../service/config";

const initialState = {
  cryptoAmount: 0,
  balanceMid: 0,
  tokenData: {
    totalUserCount: 0,
    totalUsdtCount: 0
  }, 
  orderId: null,
  orderData: {},
  allSales: []
};

export const convertToCrypto = createAsyncThunk(
  "convertToCrypto",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .post(`auth/getCryptoAmountDetails`, action)
        .then((response) => {
          return response?.data;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

export const getTotalMid = createAsyncThunk(
  "getTotalMid",
  async (action, { dispatch }) => {
    try {
      const res = await axios
        .get(`${apiConfigs.API_URL}auth/getTotalMid`, action)
        .then((response) => {
          return response?.data?.totalAmount;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);
export const getTokenCount = createAsyncThunk(
  "getTokenCount",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`transactions/getTokenCount`, action)
        .then((response) => {
          return response?.data?.totalTokenCount;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);
export const getTransactionByOrderId = createAsyncThunk(
  "getTransactionByOrderId",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`transactions/getTransactionByOrderId/${action}`)
        .then((response) => {
          return response?.data?.transactionData;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

export const checkCurrentSale = createAsyncThunk(
  "checkCurrentSale",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`transactions/checkCurrentSale`)
        .then((response) => {
          return response?.data?.sales;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

export const getAllSales = createAsyncThunk(
  "getAllSales",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`auth/getAllSales`)
        .then((response) => {
          return response?.data?.sales;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

const currencySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetTokenData: (state, { payload }) => ({
      ...state,
      tokenData: { totalUserCount: '0.00', totalUsdtCount: '0.00' },
    }),
    resetCryptoAmount: (state, { payload }) => ({
      ...state,
      cryptoAmount: 0,
    }),
    setOrderId: (state, { payload }) => ({
      ...state,
      orderId: payload,
    }),
  },
  extraReducers(builder) {
    builder
      .addCase(convertToCrypto.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.cryptoAmount = action.payload;
      })
      .addCase(getTotalMid.fulfilled, (state, action) => {
        if (action?.payload === undefined) {
          return;
        }
        state.balanceMid = action.payload;
      })
      .addCase(getTokenCount.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.tokenData  = action.payload;
      })
      .addCase(getTransactionByOrderId.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.orderData = action.payload;
      })
      .addCase(checkCurrentSale.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.sales = action.payload;
      })
      .addCase(getAllSales.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.allSales = action.payload;
      });
  },
});
export const { resetTokenData, resetCryptoAmount, setOrderId } =
  currencySlice.actions;
export default currencySlice.reducer;
