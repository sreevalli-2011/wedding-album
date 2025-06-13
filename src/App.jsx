// src/App.jsx (Example - modify where your main app component mounts/dispatches)
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAlbums } from './redux/albumsSlice';
// NEW IMPORTS: fetchGlobalStats and incrementAlbumsViewed from globalStatsSlice
import { fetchGlobalStats, incrementAlbumsViewed } from './redux/globalStatsSlice';
import TopBar from './components/TopBar';
import AlbumPage from './components/AlbumPage';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch initial data from Firebase when the app starts
    dispatch(fetchAlbums()); // This now fetches albums and comments from Firestore
    dispatch(fetchGlobalStats()); // NEW: Fetch global stats (likes, comments, views) from Firestore
    dispatch(incrementAlbumsViewed()); // NEW: Increment album views in Firestore on app load
  }, [dispatch]); // Dependency array to run only once on mount

  return (
    <div className="App">
      <TopBar />
      <div className="content-wrap"> {/* Add padding-top to prevent content from going under fixed TopBar */}
        <AlbumPage />
      </div>
      {/* Other components */}
    </div>
  );
}

export default App;