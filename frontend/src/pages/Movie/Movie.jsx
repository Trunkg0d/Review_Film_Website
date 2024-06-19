// Movie.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';
import Reviews from '../../components/Review/Reviews';
import male from './assets/man.png';
import female from './assets/woman.png';

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [selectedCast, setSelectedCast] = useState(null);

  const handleMouseEnter = (castMember) => {
    setSelectedCast(castMember);
  };

  const handleMouseLeave = () => {
    setSelectedCast(null);
  };

  const handleCastImg = (profile_image) => {
    return profile_image ? `url(https://image.tmdb.org/t/p/w200${profile_image})` : `url(https://kenh14cdn.com/thumb_w/660/203336854389633024/2023/3/26/photo-4-16798103252071787385239.jpeg)`;
  }


  useEffect(() => {
    axios.get(`http://localhost:8000/movie/${id}`)
      .then(response => {
        setMovie(response.data);
        setCast(response.data.actors)
      })
      .catch(error => console.log(error.message));
  }, [id]); // Add id as a dependency

  const getImageUrl = (path, defaultImage) => {
    return path ? `https://image.tmdb.org/t/p/w500/${path}` : defaultImage;
  };

  return (
    <>
      {
        movie && (
          <>
            <div className="movie-banner"
              style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")` }}>
            </div>
            <div className="mb-3 movie-content container">
              <div className="movie-content__poster">
                <div className="movie-content__poster__img"
                  style={{ backgroundImage: `url(${getImageUrl(movie.poster_path)})` }}>
                </div>
              </div>
              <div className="movie-content__info">
                <div className="title">
                  {movie.title}
                </div>
                <div className="genres">
                  {
                    movie.tags && movie.tags.map((tag, i) => (
                      <span key={i} className="genres__item">{tag}</span>
                    ))
                  }
                </div>
                <p className="overview">{movie.description}</p>
                <div className="cast">
                  <div className="about-cast-container">
                    <div className="about-cast">
                      Diễn viên
                    </div>
                  </div>
                  <div className="cast-container">
                    {cast.map((member, index) => (
                      <div key={member._id} className="cast-item" onMouseEnter={() => handleMouseEnter(member)} onMouseLeave={handleMouseLeave}>
                        <div className="cast-image" style={{ backgroundImage: handleCastImg(member.profile_image) }}>
                        </div>
                        <div className="cast-name">{member.name}</div>
                        {selectedCast && selectedCast._id === member._id && (
                          <CastDetailModal castMember={member}/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
      <Reviews id={id} />
    </>
  );
}

function CastDetailModal(props) {

  const castMember = props.castMember;
  
  const getGender = (gender) => {
    if (gender === 'Male')
      return male;
    else
      return female;
  };

  const handleCastImg = (profile_image) => {
    return profile_image ? `url(https://image.tmdb.org/t/p/w200${profile_image})` : `url(https://kenh14cdn.com/thumb_w/660/203336854389633024/2023/3/26/photo-4-16798103252071787385239.jpeg)`;
  }

  return (
          <div className="cast-detail">
              <div className="avatar" style={{ backgroundImage: handleCastImg(castMember.profile_image) }}/>
              <div className="info-container">
                  <div className="name">{castMember.name}</div>
                  <div className="other-container">
                    <div className="dob">{castMember.born}</div>
                    <div className="icon"><img src={getGender(castMember.gender)} alt=''/></div>
                    <div className="job">Vai trò: {castMember.job[0]}</div>
                  </div>
              </div>
          </div>
  );
}

export default Movie;
