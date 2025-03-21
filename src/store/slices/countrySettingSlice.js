import { createSlice } from "@reduxjs/toolkit";

const countrySlice = createSlice({
  name: "countrySlice",
  initialState: {
    countryName: "",
    phoneCode: "",
    currency: "",
  },
  reducers: {
    defineCountry: (state, { payload }) => ({
      ...state,
      countryName: payload,
    }),
    definePhoneCode: (state, { payload }) => ({
      ...state,
      phoneCode: payload,
    }),
    defineCurrency: (state, { payload }) => ({
      ...state,
      currency: payload,
    }),
  },
});

export const { defineCountry, definePhoneCode, defineCurrency } =countrySlice.actions;

export default countrySlice.reducer;