import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reviews.css';

function Reviews({ id }) {
    const [reviews, setReviews] = useState([]);
    const [replies, setReplies] = useState({});
    const [newComments, setNewComments] = useState({});
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
    const [activeReviewId, setActiveReviewId] = useState(null);
    const [newReviewText, setNewReviewText] = useState("");
    const [editReviewId, setEditReviewId] = useState(null);
    const [editReviewText, setEditReviewText] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/review/movie/${id}`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => console.error(error.message));
    }, [id]);

    const handleLike = (reviewId) => {
        // Handle like functionality
    };

    const handleCancel = () => {
        setNewReviewText('');
        setIsCommentBoxVisible(false);
    };

    const handleReply = (reviewId) => {
        const newComment = newComments[reviewId] || "";
        if (newComment.trim() === "") {
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

    const handleNewReviewSubmit = () => {
        if (newReviewText.trim() === "") {
            return;
        }

        const newReview = {
            content: newReviewText,
            movie_id: id,
            // Include additional necessary fields and user information
        };

        const token = localStorage.getItem('accessToken');
        axios.post('http://localhost:8000/review/new', newReview, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setReviews([...reviews, newReview]);
                setNewReviewText("");
            })
            .catch(error => console.error(error.message));
    };

    const handleEditReview = (reviewId) => {
        const review = reviews.find(review => review.id === reviewId);
        if (review) {
            setEditReviewId(reviewId);
            setEditReviewText(review.content);
        }
    };

    const handleEditReviewChange = (e) => {
        setEditReviewText(e.target.value);
    };

    const handleEditReviewSubmit = () => {
        if (editReviewText.trim() === "") {
            return;
        }

        const updatedReview = {
            content: editReviewText,
        };

        const token = localStorage.getItem('accessToken');
        axios.put(`http://localhost:8000/review/content/${editReviewId}`, updatedReview, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then(response => {
                const updatedReviews = reviews.map(review => {
                    if (review.id === editReviewId) {
                        return { ...review, content: editReviewText };
                    }
                    return review;
                });
                setReviews(updatedReviews);
                setEditReviewId(null);
                setEditReviewText("");
            })
            .catch(error => console.error(error.message));
    };

    return (
        <div className="reviews-container">
            <section id="reviews" className="reviews">
                <div className="title-row">
                    <h2 className="section-title">Reviews</h2>
                </div>
                <div className="new-review">
                    <div className="new-review__header">
                        <img src={'https://kenh14cdn.com/203336854389633024/2023/1/10/photo-1-1673332882261583702192.jpg'} alt="User Avatar" className="new-review__avatar" />
                        <textarea 
                            className="new-review__input"
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Write your review here..."
                            rows={1}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                        />
                    </div>
                    <div className="new-review__actions">
                        <button className="new-review__submit" onClick={handleNewReviewSubmit}>Submit</button>
                        <button className="new-review__cancel" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
                <div className="reviews__list">
                    {
                        reviews.length > 0 ? (
                            reviews.map((review, i) => (
                                <div key={i} className="review">
                                    <div className="review__header">
                                        <div className="review__header__user">
                                            <div className="review__header__user__img"></div>
                                            <div className="review__header__user__name">{review.user_info.username}</div>
                                        </div>
                                    </div>
                                    <div className="review__content">
                                        {editReviewId === review.id ? (
                                            <textarea 
                                                value={editReviewText}
                                                onChange={handleEditReviewChange}
                                            />
                                        ) : (
                                            review.content.length > 200 ? (
                                                <div>
                                                    {review.content.substring(0, 200)}
                                                    {activeReviewId === review.id && (
                                                        <span>{review.content.substring(200)}</span>
                                                    )}
                                                    <button onClick={() => toggleCommentBox(review.id)}>
                                                        {activeReviewId === review.id && isCommentBoxVisible ? 'Hide' : 'Show More'}
                                                    </button>
                                                </div>
                                            ) : (
                                                review.content
                                            )
                                        )}
                                    </div>
                                    <div className="review__actions">
                                        <button onClick={() => handleLike(review.id)}>Upvote</button>
                                        <button onClick={() => handleLike(review.id)}>Downvote</button>
                                        {editReviewId === review.id ? (
                                            <button onClick={handleEditReviewSubmit}>Save</button>
                                        ) : (
                                            <button onClick={() => handleEditReview(review.id)}>Edit</button>
                                        )}
                                    </div>
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
