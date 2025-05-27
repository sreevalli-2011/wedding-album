// src/components/AlbumPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import AlbumGrid from './AlbumGrid';
import CommentsSection from './CommentSection';

// This component will orchestrate the layout of the album flipbook and comments section
function AlbumPage() {
    const { albumId: urlAlbumId } = useParams();
    const currentAlbumId = urlAlbumId || "wedding-album-flipbook";

    if (!currentAlbumId) {
        return <p className="text-center p-5 text-danger">Error: Album ID not found.</p>;
    }

    return (
        <section className="album-page-section py-4">
            <div className="container">

                {/* --- Main "My Wedding Album" Title (on page's default background, centered) --- */}
                <div className="row justify-content-center mb-4">
                    <div className="col-12 text-center">
                        <h1 className="main-album-title text-white">Wedding Album</h1>
                    </div>
                </div>

                {/* --- "A beautiful collection of memories" Description (on page's default background, centered) --- */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 col-lg-6 text-center">
                        <p className="main-album-description text-white mt-5">A Beautiful Collection of Memories.</p>
                    </div>
                </div>

                {/* --- AlbumGrid Component (now wider) --- */}
                <div className="row justify-content-center mb-5">
                    {/* CHANGED: Increased col-lg to 10 for wider display */}
                    <div className="col-12 col-md-10 col-lg-10">
                        <AlbumGrid albumId={currentAlbumId} />
                    </div>
                </div>

                {/* --- Vertical Space Between AlbumGrid and CommentSection --- */}
                <div className="my-5"></div>

                {/* --- CommentsSection Component (now wider, to match AlbumGrid) --- */}
                <div className="row justify-content-center mb-5">
                    {/* CHANGED: Increased col-lg to 10 for wider display */}
                    <div className="col-12 col-md-10 col-lg-10">
                        <CommentsSection albumId={currentAlbumId} />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default AlbumPage;