// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import albumsReducer from './albumsSlice';
import globalStatsReducer from './globalStatsSlice'; // <-- Make sure this import is correct

export const store = configureStore({
  reducer: {
    albums: albumsReducer,
    globalStats: globalStatsReducer, // <-- This line is CRUCIAL for the error you're seeing
  },
});