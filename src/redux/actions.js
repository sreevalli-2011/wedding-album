// src/redux/actions.js

// Action Types
export const INCREMENT_TOTAL_LIKES = 'INCREMENT_TOTAL_LIKES';
export const INCREMENT_TOTAL_COMMENTS = 'INCREMENT_TOTAL_COMMENTS'; // <--- NEW ACTION TYPE

// Action Creators
export const incrementTotalLikes = () => ({
  type: INCREMENT_TOTAL_LIKES,
});

export const incrementTotalComments = () => ({ // <--- NEW ACTION CREATOR
  type: INCREMENT_TOTAL_COMMENTS,
});

// Removed SET_TOTAL_COMMENTS as we will now only increment