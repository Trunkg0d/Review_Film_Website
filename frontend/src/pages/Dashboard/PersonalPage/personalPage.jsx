import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import user_icon from '../assets/user.png';
import email_icon from '../assets/email.png';
import './personalPage.css';

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

  useEffect(() => {
    axios.get(`http://localhost:8000/user/profile/${user_id}`)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => console.log(error.message));
  }, [user_id]);

  const watchList = userInfo.wish_list;

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
          
        </div>
      </div>
    </div>)}
    </>
  );
}

export default PPage;