// src/redux/reducers.js
import { combineReducers } from 'redux';
import { INCREMENT_TOTAL_LIKES, INCREMENT_TOTAL_COMMENTS } from './actions'; // <--- Import new action type

// --- Local Storage Helpers (These remain unchanged) ---
const loadState = (key, defaultState) => {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) {
        return defaultState;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error(`Error loading state from localStorage for key "${key}":`, err);
      return defaultState;
    }
  }
  return defaultState;
};

const saveState = (key, state) => {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    } catch (err) {
      console.error(`Error saving state to localStorage for key "${key}":`, err);
    }
  }
};

// --- Initial State for our Redux slices ---
const initialGlobalState = {
  totalLikes: loadState('totalGlobalLikes', 0),
  totalComments: loadState('totalGlobalComments', 0), // <--- Initialize comments to 0 if starting fresh
};

// --- Main Reducer Function ---
const globalStatsReducer = (state = initialGlobalState, action) => {
  switch (action.type) {
    case INCREMENT_TOTAL_LIKES:
      const newTotalLikes = state.totalLikes + 1;
      saveState('totalGlobalLikes', newTotalLikes);
      return {
        ...state,
        totalLikes: newTotalLikes,
      };
    case INCREMENT_TOTAL_COMMENTS: // <--- NEW CASE FOR INCREMENTING COMMENTS
      const newTotalComments = state.totalComments + 1;
      saveState('totalGlobalComments', newTotalComments);
      return {
        ...state,
        totalComments: newTotalComments,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  globalStats: globalStatsReducer,
});

export default rootReducer;