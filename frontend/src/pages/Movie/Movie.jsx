// Movie.jsx
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import './Movie.css';
import Reviews from '../../components/Review/Reviews';

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/data/movies_data.json`)
    .then(response => response.json())
    .then(data => {
      const foundMovie = data.find(movie => movie.id === parseInt(id));
      setMovie(foundMovie);
    })
    .catch(error => console.log(error.message));
  }, [id]); // Add id as a dependency

  return (
    <>
      {
        movie && (
            <>
            <div className="movie-banner" 
            style={{backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`}}></div>
            <div className="mb-3 movie-content container">
              <div className="movie-content__poster">
                <div className="movie-content__poster__img"
                style={{backgroundImage: `url("https://image.tmdb.org/t/p/w500/${movie.poster_path}")`}}></div>
              </div>
              <div className="movie-content__info">
                <div className="title">
                  {movie.title}
                </div>
                <div className="genres">
                  {
                    movie.tags && movie.tags.map((tag, i) => (
                      <span key={i} className="genres__item">{tag.name}</span>
                    ))
                  }
                </div>
                <p className="overview">{movie.description}</p>
                <div className="cast">
                  <div className="section_header">
                    {/* <h2>Cast</h2> */}
                  </div>
                  {/*Cast list goes here*/}
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