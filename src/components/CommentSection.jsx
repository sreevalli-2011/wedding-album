// src/components/CommentSection.jsx
import { useDispatch, useSelector } from "react-redux";
import React, { useState, forwardRef, useEffect } from 'react';
import ReactGA from "react-ga4";
// REMOVED: import { addComment, toggleLike, fetchAlbums } from "../redux/albumsSlice";
// NEW: Import addCommentToFirestore and fetchAlbums
import { fetchAlbums, addCommentToFirestore } from "../redux/albumsSlice";
// Ensure fetchGlobalStats is imported if needed, and toggleGlobalLike is already there
import { toggleGlobalLike } from "../redux/globalStatsSlice";

import "./CommentSection.css";

const CommentSection = forwardRef(({ albumId }, ref) => {
  const [newCommentText, setNewCommentText] = useState('');
  const dispatch = useDispatch();

  const albumStatus = useSelector(state => state.albums.status);
  const currentAlbum = useSelector(state =>
    state.albums.list.find(a => a.id === albumId)
  );
  // Ensure comments array exists before trying to map over it
  const comments = currentAlbum?.comments || [];

  const totalLikes = useSelector(state => state.globalStats.totalLikes);
  const totalComments = useSelector(state => state.globalStats.totalComments);

  // Logic to determine comment quality text based on totalComments
  let commentQualityText = 'No Comments';
  if (totalComments > 0 && totalComments <= 5) {
    commentQualityText = 'Good';
  } else if (totalComments > 5 && totalComments <= 15) {
    commentQualityText = 'Great';
  } else if (totalComments > 15) {
    commentQualityText = 'Awesome';
  }

  useEffect(() => {
    // This fetches album data including comments from Firestore
    // It's good to have this here if AlbumPage might render before App.jsx's useEffect fully completes,
    // or if the component is mounted independently.
    if (albumStatus === 'idle') {
      dispatch(fetchAlbums());
    }
  }, [albumStatus, dispatch]);


  const handleAddComment = () => {
    if (newCommentText.trim()) {
      // NEW: Dispatch the async thunk to add comment to Firestore
      dispatch(addCommentToFirestore({ albumId, text: newCommentText }));
      setNewCommentText(''); // Clear the input field after submitting
      // ReactGA.event({ category: 'Comments', action: 'Comment Added', label: `Album ID: ${albumId}` }); // Keep or remove based on GA decision
      console.log(`GA Event: Comment Added for Album ${albumId}`); // For debugging GA
    }
  };

  const handleToggleLike = () => {
    // This now dispatches the async thunk from globalStatsSlice to update Firestore
    dispatch(toggleGlobalLike());
    // ReactGA.event({ category: 'Likes', action: 'Global Like Toggled from Comments', label: `Album ID: ${albumId}` }); // Keep or remove based on GA decision
    console.log(`GA Event: Global Like Toggled from Comments for Album ${albumId}`); // For debugging GA
  };

  // Helper functions for scrolling
  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments-section-id');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading and error states for comments
  if (albumStatus === 'loading') {
    return (
        <div id="comments-section-id" ref={ref} className="comments-section-container text-center py-5">
            <p>Loading comments...</p>
        </div>
    );
  }

  // Handle case where currentAlbum might not be found after loading
  if (!currentAlbum && albumStatus === 'succeeded') {
      return (
        <div id="comments-section-id" ref={ref} className="comments-section-container text-center py-5">
            <p>Comments not available for this album.</p>
        </div>
      );
  }

  // Main render for CommentSection
  return (
    <div id="comments-section-id" ref={ref} className="comments-section-container">
        {/* Global Stats Display */}

        <h3
          className="comment-section-heading text-center mb-3"
          style={{ fontFamily: "'Roboto', 'Arial', sans-serif" }}
        >
          Album Comments ({comments.length})
        </h3>
        <div className="container">

         <div className="comment-input-container w-50 d-flex flex-column flex-md-row align-items-center justify-content-center mb-3">
            <input
                type="text"
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="comment-input mb-2 mb-md-0 me-md-2 flex-grow-1"
            />
            <button onClick={handleAddComment} className="add-comment-btn mt-5">
                Add Comment
            </button>
         </div>
        </div>

        {/* Comments List */}
        <ul className="comments-list w-100">
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    // Use comment.id for key if available from Firestore, fallback to index
                    <li key={comment.id || index} className="comment-item">
                        {comment.text}
                    </li>
                ))
            ) : (
                <li className="no-comments-message">No comments yet. Be the first!</li>
            )}
        </ul>

        {/* Like Button */}
        <div className="likes-container w-100 d-flex justify-content-center mt-3">
            <button onClick={handleToggleLike} className="like-btn">
                <span role="img" aria-label="heart">❤️</span> Like ({totalLikes})
            </button>
        </div>

        {/* Scroll Buttons */}
        <div className="text-center mt-4">
            <button onClick={scrollToTop} className="btn btn-secondary btn-sm">
                Back to Top <i className="fa fa-arrow-up"></i>
            </button>
        </div>
    </div>
  );
});

export default CommentSection;