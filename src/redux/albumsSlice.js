// src/redux/albumsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the 23 album images directly here.
// These paths are relative to the 'public' folder.
const albumImages = Array.from({ length: 23 }, (_, i) => ({
  id: i,
  url: `./images/photo_${i + 1}.jpeg`, // This path expects images in public/images/
  caption: `Wedding Photo ${i + 1}`,
}));

const mockAlbums = [
  {
    id: 'wedding-album-flipbook', // A unique ID for your flipbook album
    title: 'Our Wedding Journey',
    description: 'A beautiful collection of memories.',
    cover: '/images/photo_1.jpeg', // Use the first image as cover
    photos: albumImages, // This album's photos are your 23 flipbook images
    comments: [
      { text: 'Congratulations!', timestamp: '2024-01-01T12:00:00Z' },
      { text: 'Stunning photos!', timestamp: '2024-01-02T15:30:00Z' },
    ],
    likes: 50,
    isFavorite: true,
  },
  // If you had other albums (Nature, Cityscape), remove them for now to simplify
  // If you *still* want them, we can add logic back later.
];

export const fetchAlbums = createAsyncThunk(
  'albums/fetchAlbums',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAlbums; // This will now return only your single wedding album
  }
);

const albumsSlice = createSlice({
  name: 'albums',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addComment: (state, action) => {
      const { albumId, text } = action.payload;
      const existingAlbum = state.list.find(album => album.id === albumId);
      if (existingAlbum) {
        if (!existingAlbum.comments) {
          existingAlbum.comments = [];
        }
        existingAlbum.comments.push({ text, timestamp: new Date().toISOString() });
      }
    },
    toggleLike: (state, action) => {
      const { albumId } = action.payload;
      const existingAlbum = state.list.find(album => album.id === albumId);
      if (existingAlbum) {
        existingAlbum.likes = (existingAlbum.likes || 0) + 1;
      }
    },
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
      .addCase(fetchAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addComment, toggleLike, toggleFavorite } = albumsSlice.actions;

export default albumsSlice.reducer;