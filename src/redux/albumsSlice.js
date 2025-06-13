// src/redux/albumsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs, addDoc, query, where, doc, runTransaction, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { setTotalComments } from './globalStatsSlice'; // Import action from globalStatsSlice to update total comments

// Define the 23 album images directly here.
// These paths are relative to the 'public' folder.
// This array is still used to populate the 'photos' property of your local album state,
// since we chose not to store the large photo array directly in Firestore for simplicity.
const albumImages = Array.from({ length: 23 }, (_, i) => ({
  id: i,
  url: `./images/photo_${i + 1}.jpeg`, 
  caption: `Wedding Photo ${i + 1}`,
}));

// Async Thunk to fetch albums and their comments from Firestore
export const fetchAlbums = createAsyncThunk(
  'albums/fetchAlbums',
  async (_, { dispatch, rejectWithValue }) => { // Added dispatch to arguments
    try {
      const albumsCol = collection(db, "albums"); // Reference to the 'albums' collection
      const albumSnapshot = await getDocs(albumsCol); // Get all documents in 'albums' collection
      const albumsList = []; // Array to build our processed album data

      let totalCommentsCount = 0; // Initialize a counter for ALL comments

      for (const albumDoc of albumSnapshot.docs) {
        const albumData = { id: albumDoc.id, ...albumDoc.data() }; // Get album data and its ID

        // Fetch comments for this specific album from the 'comments' collection
        // We query comments where 'albumId' field matches the current album's ID
        const commentsQuery = query(collection(db, "comments"), where("albumId", "==", albumDoc.id));
        const commentsSnapshot = await getDocs(commentsQuery);
        // Map comment documents to objects and sort them by timestamp
        const comments = commentsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        albumData.comments = comments; // Attach fetched comments to the album data
        totalCommentsCount += comments.length; // Add this album's comment count to the global total

        // IMPORTANT: Add the local albumImages array to the fetched album data
        // since we are not storing all 23 images in Firestore directly.
        if (albumData.id === 'wedding-album-flipbook') { // Apply only to your specific flipbook album
          albumData.photos = albumImages;
          albumData.isFavorite = true; // Assume default favorite for now if not in Firestore
        }

        albumsList.push(albumData); // Add processed album to the list
      }

      // After fetching all albums and their comments, dispatch to update globalStatsSlice
      // This ensures the TopBar displays the correct total comment count from Firestore
      dispatch(setTotalComments(totalCommentsCount));

      return albumsList; // Return the list of albums with their comments

    } catch (error) {
      console.error("Error fetching albums and comments:", error);
      return rejectWithValue(error.message); // Return error message if fetch fails
    }
  }
);

// Async Thunk to add a comment to Firestore and update global comment count
export const addCommentToFirestore = createAsyncThunk(
  'albums/addCommentToFirestore',
  async ({ albumId, text }, { dispatch, rejectWithValue }) => {
    try {
      const newComment = {
        albumId,
        text,
        timestamp: new Date().toISOString(), // Store comment timestamp
      };

      // 1. Add the new comment document to the 'comments' collection in Firestore
      const docRef = await addDoc(collection(db, "comments"), newComment);

      // 2. After successfully adding the comment, update the global comment count in Firestore
      const globalStatsDocRef = doc(db, "globalStats", "appStats"); // Reference to your global stats document

      // Use a transaction for atomic update of global stats to prevent race conditions
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(globalStatsDocRef); // Get the current global stats document
        if (!sfDoc.exists()) {
          // If the global stats document doesn't exist, create it with initial values
          transaction.set(globalStatsDocRef, { totalComments: 0, totalLikes: 0, totalAlbumsViewed: 0 });
        } else {
          // Increment the existing totalComments count
          const newTotalComments = (sfDoc.data().totalComments || 0) + 1;
          transaction.update(globalStatsDocRef, { totalComments: newTotalComments });
        }
      });

      // 3. Fetch the updated global comments count from Firestore to ensure Redux is accurate
      const updatedGlobalStats = await getDoc(globalStatsDocRef);
      const currentTotalComments = updatedGlobalStats.data().totalComments;

      // 4. Dispatch setTotalComments to update globalStatsSlice's totalComments state
      dispatch(setTotalComments(currentTotalComments));

      // Return the new comment (with its Firestore ID) to update albumsSlice's local state
      return { albumId, comment: { id: docRef.id, ...newComment } };

    } catch (error) {
      console.error("Error adding comment to Firestore:", error);
      return rejectWithValue(error.message); // Return error message if operation fails
    }
  }
);


const albumsSlice = createSlice({
  name: 'albums',
  initialState: {
    list: [],
    status: 'idle', // Status for fetching albums (idle, loading, succeeded, failed)
    error: null,
  },
  reducers: {
    // addComment reducer is REMOVED, as its logic is now handled by addCommentToFirestore's fulfilled case
    // toggleLike reducer is REMOVED, as global likes are handled by globalStatsSlice
    // Keep toggleFavorite if it's only a local UI state and not intended for persistence yet
    toggleFavorite: (state, action) => {
      const { albumId } = action.payload;
      const existingAlbum = state.list.find(album => album.id === albumId);
      if (existingAlbum) {
        existingAlbum.isFavorite = !existingAlbum.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Handlers for fetchAlbums ---
      .addCase(fetchAlbums.pending, (state) => {
        state.status = 'loading'; // Set status to loading while fetching
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded
        state.list = action.payload; // Update album list with data from Firestore
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.error.message; // Store the error message
      })
      // --- Handlers for addCommentToFirestore ---
      .addCase(addCommentToFirestore.fulfilled, (state, action) => {
        const { albumId, comment } = action.payload;
        const existingAlbum = state.list.find(album => album.id === albumId);
        if (existingAlbum) {
          // If comments array doesn't exist, initialize it
          if (!existingAlbum.comments) {
            existingAlbum.comments = [];
          }
          existingAlbum.comments.push(comment); // Add the new comment to the album's comments array
        }
      })
      .addCase(addCommentToFirestore.rejected, (state, action) => {
        console.error("Failed to add comment:", action.payload);
        // You could add more robust error handling here (e.g., show an error message to the user)
      });
  },
});

export const { toggleFavorite } = albumsSlice.actions; // Only export toggleFavorite as others are now thunks
export default albumsSlice.reducer;