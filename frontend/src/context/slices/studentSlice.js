// store/slices/studentSlice.js

import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "students",
  initialState: [],

  reducers: {
    setStudentsValue: (state, action) => {
      return action.payload;
    },

    clearStudents: () => {
      return null;
    },
  },
});

export const { setStudentsValue, clearStudents } = studentSlice.actions;
export default studentSlice.reducer;