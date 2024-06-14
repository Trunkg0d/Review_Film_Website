import React, { useEffect, useState } from 'react';
import './Reviews.css';

function Reviews({ id }) {
    const [reviews, setReviews] = useState([]);
    const [replies, setReplies] = useState({});
    const [newComments, setNewComments] = useState({});
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
    const [activeReviewId, setActiveReviewId] = useState(null);
    const [newReviewText, setNewReviewText] = useState(""); // State for new comment
    // const [editReviewId, setEditReviewId] = useState(null); // State for editing review
    // const [editReviewText, setEditReviewText] = useState(""); // State for the text being edited

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
                console.log(foundReview);
            })
            .catch(error => console.error(error.message));
    }, [id]);

    const handleLike = (reviewId) => {
        // Handle like functionality
    };

    const handleCancel = () => {
        setNewReviewText('');
        setIsCommentBoxVisible(false);
    }

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

    // const handleNewReviewChange = (e) => {
    //     setNewReviewText(e.target.value);
    // };

    const handleNewReviewSubmit = () => {
        if (newReviewText.trim() === "") {
            // Do not add an empty comment
            return;
        }

        const newReview = {
            author: { username: "Current User" }, // Replace with actual user data
            comment: newReviewText,
            review_id: reviews.length + 1 // Generate a new ID for the review
        };

        setReviews([...reviews, newReview]);
        setNewReviewText(""); // Clear the input box
    };

    // const handleEditReview = (reviewId) => {
    //     const review = reviews.find(review => review.review_id === reviewId);
    //     if (review) {
    //         setEditReviewId(reviewId);
    //         setEditReviewText(review.comment);
    //     }
    // };

    // const handleEditReviewChange = (e) => {
    //     setEditReviewText(e.target.value);
    // };

    // const handleEditReviewSubmit = () => {
    //     if (editReviewText.trim() === "") {
    //         // Do not update with an empty comment
    //         return;
    //     }

    //     const updatedReviews = reviews.map(review => {
    //         if (review.review_id === editReviewId) {
    //             return { ...review, comment: editReviewText };
    //         }
    //         return review;
    //     });

    //     setReviews(updatedReviews);
    //     setEditReviewId(null); // Exit edit mode
    //     setEditReviewText(""); // Clear the input box
    // };

    return (
        <div className="reviews-container">
            <section id="reviews" className="reviews">
                <div className="title-row">
                    <h2 className="section-title">Reviews</h2>
                </div>
                {/* <div className="new-review">
                    <textarea
                        value={newReviewText}
                        onChange={handleNewReviewChange}
                        placeholder="Write a review..."
                        className="new-review__input"
                    />
                    <button onClick={handleNewReviewSubmit} className="new-review__submit">Submit</button>
                </div> */}
                <div className="new-review">
                    <div className="new-review__header">
                        <img src={'https://kenh14cdn.com/203336854389633024/2023/1/10/photo-1-1673332882261583702192.jpg'} alt="User Avatar" className="new-review__avatar" />
                        {/* <textarea 
                            className="new-review__input"
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Write your review here..."
                        /> */}
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
                                        {/* <button onClick={() => handleEditReview(review.review_id)}>Edit</button> */}
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

