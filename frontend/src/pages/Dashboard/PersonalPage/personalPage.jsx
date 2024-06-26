import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import user_icon from '../assets/user.png';
import email_icon from '../assets/email.png';
import './personalPage.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function PPage() {
  const { user_id } = useParams();
  const [userInfo, setUserInfo] = useState({
    fullname: '',
    username: '',
    email: '',
    img: '',
    role: 0,
    wish_list: []
  });
  const [reviewsWithMovies, setReviewsWithMovies] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/user/profile/${user_id}`)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => console.log(error.message));
  }, [user_id]);

  const watchList = userInfo.wish_list;

  useEffect(() => {
    axios.get(`http://localhost:8000/review/user/${user_id}`)
      .then(async (response) => {
        const reviews = response.data;
        const movieInfoPromises = reviews.map(review => 
          axios.get(`http://localhost:8000/movie/${review.movie_id}`)
            .then(movieResponse => ({ ...review, movie: movieResponse.data }))
            .catch(error => ({ ...review, movie: null }))
        );
        const reviewsWithMoviesData = await Promise.all(movieInfoPromises);
        setReviewsWithMovies(reviewsWithMoviesData);
      })
      .catch(error => console.log(error.message));
  }, [user_id]);

  const handleImageUser = (imgPath) => {
    return (imgPath === null) ? user_icon : `http://localhost:8000/user/image/${imgPath}`;
  }
  
  const getImageUrl = (path, defaultImage) => {
    return path ? `https://image.tmdb.org/t/p/w500/${path}` : defaultImage;
  };

  return (
    <>{userInfo && (
    <div className="wrapper-ppage">
      <div className="cover-container">
        <img src={handleImageUser(userInfo.img)} alt="" className="avatar-img" />
        <div className="basic-info-container">
          <h1 className="user-fullname">{userInfo.fullname}</h1>
          <text className="username">{userInfo.username}</text>
          <div className="email-contact">
            <img src={email_icon} alt="" className="email-icon"/>
            {userInfo.email}
          </div>
        </div>
      </div>
      <div className="user-database">
        <div className="user-watchlist">
          {
          watchList.length > 0 ? (
            watchList.map((movie, i) => (
                <a href={`/movie/${movie.movie_id}`} key={i} className="movie">
                  <img src={getImageUrl(movie.poster_path)} alt="" className="movie-poster"/>
                  <div className="movie-name">{movie.title}</div>
                </a>
            ))
          ) : (
            <div className="no-movie-added">
                <p>Nothing added yet!</p>
            </div>
            )}
        </div>
        <div className="border-splitter"/>
        <div className="user-reviews">
        {
            reviewsWithMovies.length > 0 ? (
              reviewsWithMovies.map((review, i) => (
                <div key={i} className="review-post-container">
                  {review.movie && (<>
                    <a href={`/movie/${review.movie_id}`}>
                      <img src={getImageUrl(review.movie.poster_path)} alt={review.movie.title} className="movie-poster"/>
                    </a>
                    <div className="movie-info">
                      <a href={`/movie/${review.movie_id}`} className="movie-title">
                        <div>{review.movie.title}</div>
                      </a>
                      <div className="review-date">Date: {formatDate(review.created_at)}</div>
                      <div className="review-content">{review.content}</div>
                    </div></>
                  )}
                </div>
              ))
            ) : (
              <></>
            )
          }
        </div>
      </div>
    </div>)}
    </>
  );
}

export default PPage;