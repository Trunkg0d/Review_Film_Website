// Banner.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Banner.css';

function Banner() {
    const [movies, setMovies] = useState([]);
    const [bannerMovieIndex, setBannerMovieIndex] = useState(0);

    useEffect(() => {
        axios.get('https://api.themoviedb.org/3/trending/all/day?api_key=062df5711fbb408fac7c50d0c4bed4a7')
        .then(response => {
            setMovies(response.data.results);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
        setBannerMovieIndex(prevIndex => (prevIndex + 1) % movies.length);
        }, 10000); // Change banner movie every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [movies]);

  const bannerMovie = movies[bannerMovieIndex];
  return (
    (bannerMovie && // Only render banner if there is a banner movie
    <div 
        className="banner"
        style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${bannerMovie.backdrop_path}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '500px',
        width: '100%',
        boxSizing: 'border-box',
        }}
    >
        <a href={`/movie/${bannerMovie.id}`} className="banner-link" aria-label="Banner link to movie details"></a>
        <div className="banner-content">
        <h1 className="banner-title">{bannerMovie.title || bannerMovie.name}</h1>
        <p className="banner-description">{bannerMovie.overview}</p>
        </div>
    </div>)
  );
}

export default Banner;