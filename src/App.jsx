// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported here once

// IMPORTANT: Your Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-9BGZ6L410B';

// components
import TopBar from './components/TopBar';
import AlbumPage from './components/AlbumPage'; // Import the new AlbumPage component
import './App.css'; // Your App-specific CSS

// Initialize Google Analytics ONCE when the app starts
ReactGA.initialize(GA_MEASUREMENT_ID);

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title
    });
    console.log(`GA Pageview sent for: ${location.pathname + location.search}`);
  }, [location]);

  return (
    <div className="App">
      <TopBar /> {/* TopBar is usually always visible, so place it outside Routes */}

      <main> {/* Remove padding from main here, let individual pages control it */}
        <Routes>
          {/* Route for the main home page */}
          <Route
            path="/"
            element={
              <div className="container py-5 text-center"> {/* Use Bootstrap container for centering */}
                <h2>Welcome to Your React Album!</h2>
                <p>Explore your collections.</p>
                <Link to="/albums" className="btn btn-primary mt-3"> {/* Use Bootstrap button class */}
                  View All Albums
                </Link>
              </div>
            }
          />

          {/* Route for displaying the main wedding album (or a grid if you had more) */}
          {/* AlbumPage component will handle rendering AlbumGrid and CommentSection together */}
          <Route
            path="/albums"
            element={<AlbumPage albumId="wedding-album-flipbook" />} // Pass the specific ID for the default album
          />

          {/* Route for displaying a specific album by ID */}
          <Route
            path="/album/:albumId"
            element={<AlbumPage />} // AlbumPage will automatically get albumId from URL via useParams
          />

          {/* Catch-all for invalid routes */}
          <Route path="*" element={<h2 className="text-center py-5">404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;