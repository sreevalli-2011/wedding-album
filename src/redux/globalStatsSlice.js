// src/redux/globalStatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase'; // Import your Firestore instance
import { doc, getDoc, updateDoc, increment, runTransaction } from 'firebase/firestore'; // Import Firestore functions

// Define the fixed ID for your global stats document in Firestore
const GLOBAL_STATS_DOC_ID = "appStats";

// Async Thunk to fetch global stats (totalLikes, totalComments, totalAlbumsViewed) from Firestore
export const fetchGlobalStats = createAsyncThunk(
  'globalStats/fetchGlobalStats',
  async (_, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "globalStats", GLOBAL_STATS_DOC_ID); // Reference to the appStats document
      const docSnap = await getDoc(docRef); // Get the document snapshot

      if (docSnap.exists()) {
        // If the document exists, return its data
        return docSnap.data();
      } else {
        // If the document doesn't exist (e.g., first run), return default zeros.
        // Firestore will automatically create it with these values when the first update occurs.
        return { totalLikes: 0, totalComments: 0, totalAlbumsViewed: 0 };
      }
    } catch (error) {
      console.error("Error fetching global stats:", error);
      return rejectWithValue(error.message); // Return error message if fetch fails
    }
  }
);

// Async Thunk to toggle global like (incrementing it persistently in Firestore)
export const toggleGlobalLike = createAsyncThunk(
  'globalStats/toggleGlobalLike',
  async (_, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "globalStats", GLOBAL_STATS_DOC_ID); // Reference to the appStats document

      // Use a Firestore transaction to ensure atomic increment for the like count.
      // This prevents race conditions if multiple users like at the exact same time.
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef); // Get the current state of the document within the transaction

        if (!sfDoc.exists()) {
          // If the document doesn't exist, create it with totalLikes = 1 and other counts at 0
          transaction.set(docRef, { totalLikes: 0, totalComments: 0, totalAlbumsViewed: 0 });
        } else {
          // If it exists, increment the totalLikes field
          const newLikes = (sfDoc.data().totalLikes || 0) + 1; // Get current likes, default to 0 if undefined
          transaction.update(docRef, { totalLikes: newLikes }); // Update the document in the transaction
        }
      });

      // After the transaction, fetch the updated value to keep the Redux state accurate.
      const updatedDoc = await getDoc(docRef);
      return updatedDoc.data().totalLikes; // Return the new totalLikes count

    } catch (error) {
      console.error("Error toggling global like:", error);
      return rejectWithValue(error.message); // Return error message if transaction fails
    }
  }
);

// Async Thunk to increment album views persistently in Firestore
export const incrementAlbumsViewed = createAsyncThunk(
  'globalStats/incrementAlbumsViewed',
  async (_, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "globalStats", GLOBAL_STATS_DOC_ID); // Reference to the appStats document

      // Use updateDoc with Firestore's 'increment' function for a direct, atomic update.
      await updateDoc(docRef, {
        totalAlbumsViewed: increment(1) // Atomically increments the field by 1
      });

      // Fetch the updated value to keep Redux in sync
      const updatedDoc = await getDoc(docRef);
      return updatedDoc.data().totalAlbumsViewed; // Return the new totalAlbumsViewed count

    } catch (error) {
      console.error("Error incrementing album views:", error);
      return rejectWithValue(error.message); // Return error message if update fails
    }
  }
);

const globalStatsSlice = createSlice({
  name: 'globalStats',
  initialState: {
    totalLikes: 0,
    totalComments: 0,
    totalAlbumsViewed: 0,
    status: 'idle', // Status for fetching global stats (idle, loading, succeeded, failed)
    error: null,
  },
  reducers: {
    // We keep setTotalComments here. It will be dispatched by albumsSlice
    // when a new comment is successfully added to Firestore.
    setTotalComments: (state, action) => {
      state.totalComments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Handlers for fetchGlobalStats ---
      .addCase(fetchGlobalStats.pending, (state) => {
        state.status = 'loading'; // Set status to loading while fetching
      })
      .addCase(fetchGlobalStats.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded
        // Update state with fetched data, default to 0 if a field is missing (e.g., first run)
        state.totalLikes = action.payload.totalLikes || 0;
        state.totalComments = action.payload.totalComments || 0;
        state.totalAlbumsViewed = action.payload.totalAlbumsViewed || 0;
      })
      .addCase(fetchGlobalStats.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Store the error message
      })
      // --- Handlers for toggleGlobalLike ---
      .addCase(toggleGlobalLike.fulfilled, (state, action) => {
        state.totalLikes = action.payload; // Update with the actual count returned from Firestore
      })
      .addCase(toggleGlobalLike.rejected, (state, action) => {
        console.error("Failed to toggle global like:", action.payload);
        // You could add more robust error handling here (e.g., show a user-friendly message)
      })
      // --- Handlers for incrementAlbumsViewed ---
      .addCase(incrementAlbumsViewed.fulfilled, (state, action) => {
        state.totalAlbumsViewed = action.payload; // Update with the actual count returned from Firestore
      })
      .addCase(incrementAlbumsViewed.rejected, (state, action) => {
        console.error("Failed to increment album views:", action.payload);
        // You could add more robust error handling here
      });
  },
});

export const { setTotalComments } = globalStatsSlice.actions; // Export setTotalComments for other slices
export default globalStatsSlice.reducer;