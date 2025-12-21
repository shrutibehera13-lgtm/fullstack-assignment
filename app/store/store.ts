"use client";

import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import userReducer from "./slices/userSlice";
import { toastMiddleware } from "./toastMiddleware";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
