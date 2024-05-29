import React, { useEffect, useState } from 'react';
import './Reviews.css';

function Reviews({ id }) {
    const [reviews, setReviews] = useState([]);
    const [replies, setReplies] = useState({});
    const [newComments, setNewComments] = useState({});
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
    const [activeReviewId, setActiveReviewId] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/data/reviews_data.json`)
            .then(response => response.json())
            .then(data => {
                const foundReview = data.find(review => review.movie_id === parseInt(id));
                if (foundReview) {
                    setReviews(foundReview.reviews);
                } else {
                    setReviews([]);
                }
            })
            .catch(error => console.error(error.message));
    }, [id]);

    const handleLike = (reviewId) => {
        // Handle like functionality
    };

    const handleReply = (reviewId) => {
        const newComment = newComments[reviewId] || "";
        if (newComment.trim() === "") {
            // Do not add an empty comment
            return;
        }

        const currentReplies = replies[reviewId] || [];
        setReplies({
            ...replies,
            [reviewId]: [...currentReplies, newComment]
        });
        setNewComments({
            ...newComments,
            [reviewId]: ""
        });
    };

    const handleInputChange = (reviewId, value) => {
        setNewComments({
            ...newComments,
            [reviewId]: value
        });
    };

    const toggleCommentBox = (reviewId) => {
        if (isCommentBoxVisible && activeReviewId === reviewId) {
            setIsCommentBoxVisible(false);
            setActiveReviewId(null);
        } else {
            setIsCommentBoxVisible(true);
            setActiveReviewId(reviewId);
        }
    };

    return (
        <div className="reviews-container">
            <section id="reviews" className="reviews">
                <div className="title-row">
                    <h2 className="section-title">Reviews</h2>
                </div>
                <div className="reviews__list">
                    {
                        reviews.length > 0 ? (
                            reviews.map((review, i) => (
                                <div key={i} className="review">
                                    <div className="review__header">
                                        <div className="review__header__user">
                                            <div className="review__header__user__img"></div>
                                            <div className="review__header__user__name">{review.author.username}</div>
                                        </div>
                                    </div>
                                    <div className="review__content">
                                        {review.comment.length > 200 ? (
                                            <div>
                                                {review.comment.substring(0, 200)}
                                                {activeReviewId === review.review_id && (
                                                    <span>{review.comment.substring(200)}</span>
                                                )}
                                                <button onClick={() => toggleCommentBox(review.review_id)}>
                                                    {activeReviewId === review.review_id && isCommentBoxVisible ? 'Hide' : 'Show More'}
                                                </button>
                                            </div>
                                        ) : (
                                            review.comment
                                        )}
                                    </div>
                                    <div className="review__actions">
                                        <button onClick={() => handleLike(review.review_id)}>Like</button>
                                        <button onClick={() => toggleCommentBox(review.review_id)}>Comment</button>
                                    </div>
                                    {(isCommentBoxVisible && activeReviewId === review.review_id) && (
                                        <div className="review__replies">
                                            {
                                                (replies[review.review_id] || []).map((reply, j) => (
                                                    <div key={j} className="reply">
                                                        {reply}
                                                    </div>
                                                ))
                                            }
                                            <input
                                                type="text"
                                                value={newComments[review.review_id] || ""}
                                                onChange={(e) => handleInputChange(review.review_id, e.target.value)}
                                                placeholder="Write a reply..."
                                            />
                                            <button onClick={() => handleReply(review.review_id)}>Reply</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-reviews">
                                <p>No reviews yet. Be the first to review this movie!</p>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    );
}

export default Reviews;
