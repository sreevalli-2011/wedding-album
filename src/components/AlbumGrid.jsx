// src/components/AlbumGrid.jsx
import React, { useEffect, forwardRef, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HTMLFlipBook from 'react-pageflip';
import ReactGA from 'react-ga4';
import { fetchAlbums } from '../redux/albumsSlice';
import { incrementAlbumsViewed } from '../redux/globalStatsSlice'; // <--- NEW: Import the new action
import './AlbumGrid.css';

const Page = forwardRef(({ image, pageNum }, ref) => {
  return (
    <div className="album-page" ref={ref}>
      <img
        src={image.url}
        alt={image.caption}
        className="img-fluid"
      />
      <div className="page-number">
        Page {pageNum}
      </div>
    </div>
  );
});

// AlbumGrid now accepts albumId as a prop
function AlbumGrid({ albumId }) {
  const dispatch = useDispatch();
  const albumStatus = useSelector(state => state.albums.status);
  const error = useSelector(state => state.albums.error);

  const flipBookRef = useRef(null);

  // Select the specific album based on the albumId prop
  const currentAlbum = useSelector(state =>
    state.albums.list.find(a => a.id === albumId)
  );

  useEffect(() => {
    if (albumStatus === 'idle') {
      dispatch(fetchAlbums());
    }
  }, [albumStatus, dispatch]);

  useEffect(() => {
    if (albumStatus === 'succeeded' && currentAlbum) {
      ReactGA.event({
        category: 'Album',
        action: 'Flipbook Album Viewed',
        label: `Album Title: ${currentAlbum.title}`
      });
      console.log(`GA Event: Flipbook Album Viewed for ${currentAlbum.title}`);

      // <--- NEW: Dispatch action to increment total albums viewed in Redux
      dispatch(incrementAlbumsViewed());
    }
  }, [albumStatus, currentAlbum, dispatch]); // <--- Added dispatch to dependency array

  let albumFlipbookContentJSX = null;

  if (albumStatus === 'loading') {
    albumFlipbookContentJSX = <p className="text-center p-5 text-white">Loading album...</p>;
  } else if (albumStatus === 'failed') {
    albumFlipbookContentJSX = <p className="text-danger text-center p-5">Error: {error}</p>;
  } else if (albumStatus === 'succeeded') {
    if (!currentAlbum) {
      albumFlipbookContentJSX = <p className="text-center p-5 text-white">Album with ID "{albumId}" not found.</p>;
    } else {
      albumFlipbookContentJSX = (
        <div className="album-flipbook-card bg-black text-white p-4 rounded shadow">
          <div className="flipbook-wrapper">
            <HTMLFlipBook
              width={350}
              height={490}
              size="stretch"
              minWidth={300}
              maxWidth={850}
              minHeight={420}
              maxHeight={1200}
              maxShadowOpacity={0.5}
              showCover={true}
              flippingTime={800}
              disableFlipByClick={true}
              ref={flipBookRef}
            >
              {currentAlbum.photos.map((image, index) => (
                <Page key={image.id || index} image={image} pageNum={index + 1} />
              ))}
            </HTMLFlipBook>
          </div>

          <div className="flipbook-navigation d-flex justify-content-center mt-3">
            <button onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()} className="btn btn-primary mr-2">
              Previous Page
            </button>
            <button onClick={() => flipBookRef.current?.pageFlip()?.flipNext()} className="btn btn-primary">
              Next Page
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {albumFlipbookContentJSX}
    </>
  );
}

export default AlbumGrid;