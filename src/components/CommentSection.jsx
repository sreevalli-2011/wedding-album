// src/components/CommentSection.jsx
import { useDispatch, useSelector } from "react-redux";
import React, { useState, forwardRef, useEffect } from 'react';
import ReactGA from "react-ga4";
import { addComment, toggleLike, fetchAlbums } from "../redux/albumsSlice";
// Assuming you have a globalStatsSlice.js with toggleGlobalLike action
// If not, we'll need to define it or reuse albumsSlice's toggleLike
import { toggleGlobalLike } from "../redux/globalStatsSlice"; // <--- NEW IMPORT

import "./CommentSection.css";

const CommentSection = forwardRef(({ albumId }, ref) => {
  const [newCommentText, setNewCommentText] = useState('');
  const dispatch = useDispatch();

  // --- Album-specific data (for comments list) ---
  const albumStatus = useSelector(state => state.albums.status);
  const currentAlbum = useSelector(state =>
    state.albums.list.find(a => a.id === albumId)
  );
  const comments = currentAlbum?.comments || [];

  // --- GLOBAL data (for likes/comments count display in CommentSection, mirroring TopBar) ---
  const totalLikes = useSelector(state => state.globalStats.totalLikes); // <--- NEW: Get GLOBAL Likes
  const totalComments = useSelector(state => state.globalStats.totalComments); // <--- NEW: Get GLOBAL Comments

  // --- Logic for qualitative comment text (copied from TopBar) ---
  let commentQualityText = 'No Comments'; // Default for 0 comments
  if (totalComments > 0 && totalComments <= 5) {
    commentQualityText = 'Good';
  } else if (totalComments > 5 && totalComments <= 15) {
    commentQualityText = 'Great';
  } else if (totalComments > 15) {
    commentQualityText = 'Awesome';
  }
  // --- END Logic ---


  useEffect(() => {
    if (albumStatus === 'idle') {
      dispatch(fetchAlbums());
    }
  }, [albumStatus, dispatch]);

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      dispatch(addComment({ albumId, text: newCommentText }));
      setNewCommentText('');
      ReactGA.event({ category: 'Comments', action: 'Comment Added', label: `Album ID: ${albumId}` });
      console.log(`GA Event: Comment Added for Album ${albumId}`);
    }
  };

  // This handleToggleLike now dispatches the GLOBAL like action
  const handleToggleLike = () => {
    dispatch(toggleGlobalLike()); // <--- NEW: Use global action
    ReactGA.event({ category: 'Likes', action: 'Global Like Toggled from Comments', label: `Album ID: ${albumId}` });
    console.log(`GA Event: Global Like Toggled from Comments for Album ${albumId}`);
  };

  // Function to scroll to the top of the page (where the TopBar is)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (albumStatus === 'loading') {
    return (
        <div id="comments-section-id" ref={ref} className="comments-section-container text-center py-5">
            <p>Loading comments...</p>
        </div>
    );
  }

  if (!currentAlbum && albumStatus === 'succeeded') {
      return (
        <div id="comments-section-id" ref={ref} className="comments-section-container text-center py-5">
            <p>Comments not available for this album.</p>
        </div>
      );
  }

  return (
    <div id="comments-section-id" ref={ref} className="comments-section-container">
        {/* --- Global Likes and Comments Section (Mirroring TopBar) --- */}
        <div className="global-stats-in-comments d-flex justify-content-center mb-4">
             {/* Likes Section */}
            <span className="likes-section-in-comments"> {/* NEW class for specific styling */}
              <i className="fa fa-heart"></i>
              Likes: <span className="badge badge-primary">{totalLikes}</span>
            </span>

            {/* Comments Section - displays qualitative text */}
            <span className="comments-section-in-comments"> {/* NEW class for specific styling */}
              <i className="fa fa-comment"></i>
              Comments: <span className="badge badge-secondary">{commentQualityText}</span>
            </span>
        </div>

        <h3 className="comment-section-heading text-center mb-3">Album Comments ({comments.length})</h3>

        <div className="comment-input-container w-100 d-flex flex-column flex-md-row align-items-center justify-content-center mb-3">
            <input
                type="text"
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="comment-input mb-2 mb-md-0 me-md-2 flex-grow-1"
            />
            <button onClick={handleAddComment} className="add-comment-btn">
                Add Comment
            </button>
        </div>

        <ul className="comments-list w-100">
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <li key={index} className="comment-item">
                        {comment.text}
                    </li>
                ))
            ) : (
                <li className="no-comments-message">No comments yet. Be the first!</li>
            )}
        </ul>

        {/* Global Like Button (using the global toggle like action) */}
        <div className="likes-container w-100 d-flex justify-content-center mt-3">
            <button onClick={handleToggleLike} className="like-btn">
                <span role="img" aria-label="heart">❤️</span> Like ({totalLikes}) {/* Displaying global likes */}
            </button>
        </div>

        {/* Button to scroll back to top */}
        <div className="text-center mt-4">
            <button onClick={scrollToTop} className="btn btn-secondary btn-sm">
                Back to Top <i className="fa fa-arrow-up"></i>
            </button>
        </div>
    </div>
  );
});

export default CommentSection;