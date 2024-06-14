// Movie.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';
import Reviews from '../../components/Review/Reviews';

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const defaultAvatar = '/data/default_avatar.png';

  useEffect(() => {
    axios.get(`http://localhost:8000/movie/${id}`)
      .then(response => {
        setMovie(response.data);
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
                  style={{ backgroundImage: `url(${getImageUrl(movie.poster_path, defaultAvatar)})` }}>
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
                  <div className="section_header">
                    <h2>Cast</h2>
                  </div>
                  <div className="cast-list">
                    {
                      movie.actors && movie.actors.slice(0, 6).map(actor => (
                        <div key={actor._id} className="cast-item">
                          <div className="cast-item__img"
                            style={{ backgroundImage: `url(${getImageUrl(actor.profile_image, defaultAvatar)})` }}>
                          </div>
                          <div className="cast-item__info">
                            <span className="cast-item__name">{actor.name}</span>
                            <span className="cast-item__character">{actor.job[0]}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="director">
                  <div className="section_header">
                    <h2>Director</h2>
                  </div>
                  <div className="director-list">
                    {
                      movie.director && movie.director.slice(0, 3).map(director => (
                        <div key={director._id} className="director-item">
                          <div className="director-item__img"
                            style={{ backgroundImage: `url(${getImageUrl(director.profile_image, defaultAvatar)})` }}>
                          </div>
                          <div className="director-item__info">
                            <span className="director-item__name">{director.name}</span>
                            <span className="director-item__character">{director.job[0]}</span>
                          </div>
                        </div>
                      ))
                    }
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

export default Movie;
