// store/slices/marksheetSlice.js

import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
  name: "subject",

  initialState: {
    subject: "{}",
  },

  reducers: {
    setSubjectData: (state, action) => {
      state.subject = action.payload;
    },

    clearSubjectData: (state) => {
      state.subject = null;
    },
  },
});

export const { setSubjectData, clearSubjectData } = subjectSlice.actions;

export default subjectSlice.reducer;
