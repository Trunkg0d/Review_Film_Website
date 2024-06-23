import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reviews.css';
import user_icon from '../LoginSignup/assets/user.png';
import delete_icon from './assets/bin.png';
import like_icon from './assets/like.png';
import unlike_icon from './assets/unlike.png';
import edit_icon from './assets/edit.png';
import save_icon from './assets/check.png';

function Reviews({ id }) {
    const [reviews, setReviews] = useState([]);
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
    const [activeReviewId, setActiveReviewId] = useState(null);
    const [newReviewText, setNewReviewText] = useState("");
    const [editReviewId, setEditReviewId] = useState(null);
    const [editReviewText, setEditReviewText] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        img: '',
        role: 0
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            setIsLoggedIn(!!token);
            const response = await axios.post('http://localhost:8000/user/profile', {}, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUserInfo(response.data);
          } catch (error) {
            console.error('Error fetching user info:', error);
            if (error.response && error.response.status === 401) {
              window.location.href = '/';
            }
          }
        };
    
        fetchUserInfo();
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/review/movie/${id}`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => console.error(error.message));
    }, [id]);

    const handleLike = (reviewId, isHelpful) => {
        const token = localStorage.getItem('accessToken');
        axios.post(`http://localhost:8000/review/${reviewId}/${isHelpful ? 'helpful' : 'not_helpful'}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setReviews(reviews.map(review => {
                    if (review.review_id === reviewId) {
                        return response.data;
                    }
                    return review;
                }));
            })
            .catch(error => console.error(error.message));
    };

    const handleCancel = () => {
        setNewReviewText('');
        setIsCommentBoxVisible(false);
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
            movie_id: id
        };

        const token = localStorage.getItem('accessToken');
        axios.post('http://localhost:8000/review/new', newReview, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setReviews([...reviews, response.data]);
                setNewReviewText("");
            })
            .catch(error => console.error(error.message));
    };

    const handleEditReview = (reviewId) => {
        const review = reviews.find(review => review.review_id === reviewId);
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
            }
        })
            .then(response => {
                const updatedReviews = reviews.map(review => {
                    if (review.review_id === editReviewId) {
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

    const handleDeleteReview = (reviewId) => {
        const token = localStorage.getItem('accessToken');
        axios.delete(`http://localhost:8000/review/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setReviews(reviews.filter(review => review.review_id !== reviewId));
            })
            .catch(error => console.error(error.message));
    };

    const handleImageUser = (imgPath) => {
        return (imgPath === null || imgPath === 'string') ? user_icon : `http://localhost:8000/user/image/${imgPath}`;
    }

    return (
        <div className="reviews-container">
            <section id="reviews" className="reviews">
                <div className="title-row">
                    <h2 className="section-title">Reviews</h2>
                </div>{isLoggedIn && (
                <div className="new-review">
                    <div className="new-review__header">
                        <img src={handleImageUser(userInfo.img)} alt='' className="new-review__avatar" />
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
                </div>)}
                <div className="reviews__list">
                    {
                        reviews.length > 0 ? (
                            reviews.map((review, i) => (
                                <div key={i} className="review">
                                    <div className="review__header">
                                        <div className="review__header__user">
                                            <div className="review__header__user__img">
                                                <img src={handleImageUser(review.user_info.img)} alt="" className='user-icon-avatar'/>
                                            </div>
                                            <div className="review__header__user__name">
                                                {review.user_info ? review.user_info.username : 'Anonymous'}
                                            </div>
                                        </div>
                                        {userInfo.role && (<img src={delete_icon} alt =''
                                        className="review__delete" 
                                        onClick={() => handleDeleteReview(review.review_id)}/>)}
                                    </div>
                                    <div className="review__content">
                                        {editReviewId === review.review_id ? (
                                            <textarea 
                                                value={editReviewText}
                                                onChange={handleEditReviewChange}
                                            />
                                        ) : (
                                            review.content.length > 200 ? (
                                                <div>
                                                    {review.content.substring(0, 200)}
                                                    {activeReviewId === review.review_id && (
                                                        <span>{review.content.substring(200)}</span>
                                                    )}
                                                    <button onClick={() => toggleCommentBox(review.review_id)}>
                                                        {activeReviewId === review.review_id && isCommentBoxVisible ? 'Hide' : 'Show More'}
                                                    </button>
                                                </div>
                                            ) : (
                                                review.content
                                            )
                                        )}
                                    </div>
                                    <div className="review__actions">
                                        <div className="action-button">
                                            <div className="action-container" onClick={() => handleLike(review.review_id, true)}>
                                                <img src={like_icon} alt='' className='review-action-icon'/>
                                                <span className='review-count'>({review.helpful?.length || 0})</span>
                                            </div>
                                            <div className="action-container" onClick={() => handleLike(review.review_id, false)}>
                                                <img src={unlike_icon} alt='' className='review-action-icon'/>
                                                <span className='review-count'>({review.not_helpful?.length || 0})</span>
                                            </div>
                                        </div>
                                        {editReviewId === review.review_id ? (
                                            <img src={save_icon} alt='' className='edit-save' onClick={handleEditReviewSubmit}/>
                                        ) : (
                                            userInfo.role && (<img src={edit_icon} alt=''
                                            className='edit-save' 
                                            onClick={() => handleEditReview(review.review_id)}/>)
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
