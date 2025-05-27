// src/components/FavoriteButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import ReactGA from 'react-ga4';
import { toggleFavorite } from '../redux/albumsSlice'; // Make sure this path is correct!

function FavoriteButton({ albumId, isFavorite }) {
  const dispatch = useDispatch();

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ albumId }));

    // Send GA event for favoriting/unfavoriting
    ReactGA.event({
      category: 'Album Actions',
      action: isFavorite ? 'Unfavorited Album' : 'Favorited Album',
      label: `Album ID: ${albumId}`
    });
    console.log(`GA Event: Album ${albumId} ${isFavorite ? 'unfavorited' : 'favorited'}`);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      style={{
        padding: '10px 15px',
        background: isFavorite ? '#ffc107' : '#007bff', // Yellow if favorited, blue if not
        color: isFavorite ? '#333' : 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        marginLeft: '15px', // Adds some space from the album title
        transition: 'background-color 0.3s ease'
      }}
    >
      {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
    </button>
  );
}

export default FavoriteButton;