// store/slices/classSlice.js

import { createSlice } from "@reduxjs/toolkit";

const classSlice = createSlice({
  name: "class",
  initialState: "A",

  reducers: {
    setClassValue: (state, action) => {
      return action.payload;
    },

    clearClass: () => {
      return null;
    },
  },
});

export const { setClassValue, clearClass } = classSlice.actions;
export default classSlice.reducer;