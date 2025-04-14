// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/AuthSlice/AuthSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
