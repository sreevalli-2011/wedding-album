// src/components/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './TopBar.css';

const TopBar = () => {
  const totalLikes = useSelector(state => state.globalStats.totalLikes);
  const totalComments = useSelector(state => state.globalStats.totalComments);
  const totalAlbumsViewed = useSelector(state => state.globalStats.totalAlbumsViewed); // <--- NEW: Get totalAlbumsViewed

  let commentQualityText = 'No Comments';
  if (totalComments > 0 && totalComments <= 5) {
    commentQualityText = 'Good';
  } else if (totalComments > 5 && totalComments <= 15) {
    commentQualityText = 'Great';
  } else if (totalComments > 15) {
    commentQualityText = 'Awesome';
  }

  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments-section-id');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="custom-topbar">
      <div className="navbar-brand-left">
        <Link to="/" className="wedding-title">Wedding Album</Link>
        <div className="subtitle">Our Beautiful Moments</div>
      </div>

      <div className="stats-container-center">
        {/* Likes Section */}
        <span className="likes-section">
          <i className="fa fa-heart"></i>
          Likes: <span className="badge badge-primary">{totalLikes}</span>
        </span>

        {/* Comments Section - now clickable */}
        <span className="comments-section" onClick={scrollToComments}>
          <i className="fa fa-comment"></i>
          Comments: <span className="badge badge-secondary">{commentQualityText}</span>
        </span>

        {/* <--- NEW: Albums Viewed Section */}
        <span className="albums-viewed-section">
          <i className="fa fa-eye"></i> {/* Using an eye icon for "viewed" */}
          Views: <span className="badge badge-success">{totalAlbumsViewed}</span> {/* Using badge-success for green */}
        </span>
      </div>
      <div className="navbar-right-placeholder"></div>
    </nav>
  );
};

export default TopBar;
