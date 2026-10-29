// store/slices/marksheetSlice.js

import { createSlice } from "@reduxjs/toolkit";

const marksheetSlice = createSlice({
  name: "marksheet",

  initialState: {
    rows: [],
    columns: [],
  },

  reducers: {
    setMarksheetData: (state, action) => {
      state.rows = action.payload.rows;
      state.columns = action.payload.columns;
    },

    clearMarksheetData: (state) => {
      state.rows = [];
      state.columns = [];
    },
  },
});

export const {
  setMarksheetData,
  clearMarksheetData,
} = marksheetSlice.actions;

export default marksheetSlice.reducer;