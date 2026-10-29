// store/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import examReducer from "./slices/examSlice";
import subjectReducer from "./slices/subjectSlice";
import classReducer from "./slices/classSlice";
import marksheetReducer from "./slices/marksheetSlice";
import formatReducer from "./slices/formatSlice";
import studentReducer from "./slices/studentSlice";
import profileReducer from "./slices/profileSlice";

const formatPersistConfig = {
  key: "format",
  storage,
};
const examPersistConfig = {
  key: "exam",
  storage,
};

const marksheetPersistConfig = {
  key: "marksheet",
  storage,
};

const rootReducer = combineReducers({
  exam: persistReducer(examPersistConfig, examReducer),
  class: classReducer,
  subject: subjectReducer,
  marksheet: persistReducer(marksheetPersistConfig, marksheetReducer),
  format: persistReducer(formatPersistConfig, formatReducer),

  // only this slice persists
  student: studentReducer,
  profile: profileReducer,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
