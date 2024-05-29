// Reviews.jsx
import React, { useEffect, useState } from 'react';
import './Reviews.css';

function Reviews({ id }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
                setLoading(false);
            });
    }, [id]); // Add id as a dependency

    if (loading) {
        return <div className="loading">Loading reviews...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

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
                                        {review.comment}
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
