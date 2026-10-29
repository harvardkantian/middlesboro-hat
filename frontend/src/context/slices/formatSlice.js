// store/slices/examSlice.js

import { createSlice } from "@reduxjs/toolkit";

const formatSlice = createSlice({
  name: "format",
  initialState: {
    format: "individual",
    subject: "",
    class: "",
  },

  reducers: {
    setFormatValue: (state, action) => {
      console.log("che bella", state, action)
      state.format = action.payload;
    },
    setFormatSubject: (state, action) => {
      state.subject = action.payload;
    },
    setFormatClass: (state, action) => {
      state.class = action.payload;
    },

    clearFormat: () => {
      return null;
    },
  },
});

export const { setFormatValue, setFormatClass, setFormatSubject,clearFormat } = formatSlice.actions;
export default formatSlice.reducer;
