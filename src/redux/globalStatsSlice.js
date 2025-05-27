// src/redux/globalStatsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const globalStatsSlice = createSlice({
  name: 'globalStats',
  initialState: {
    totalLikes: 0,
    totalComments: 0,
    totalAlbumsViewed: 0, // <--- NEW: Initialize totalAlbumsViewed
  },
  reducers: {
    toggleGlobalLike: (state) => {
      state.totalLikes += 1;
    },
    setTotalComments: (state, action) => {
      state.totalComments = action.payload;
    },
    // <--- NEW: Reducer to increment album views
    incrementAlbumsViewed: (state) => {
      state.totalAlbumsViewed += 1;
    },
  },
});

export const { toggleGlobalLike, setTotalComments, incrementAlbumsViewed } = globalStatsSlice.actions; // <--- NEW: Export the new action
export default globalStatsSlice.reducer;