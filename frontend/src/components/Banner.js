// Banner.js
import React, { useEffect, useState } from 'react';
import './Banner.css';

function Banner() {
    const [movies, setMovies] = useState([]);
    const [bannerMovieIndex, setBannerMovieIndex] = useState(0);

    const fetchData = () => {
        fetch('http://localhost:3000/data/movies_data.json')
        .then(response => response.json())
        .then(data => setMovies(data))
        .catch(error => console.log(error.message));
    };

    useEffect(() => {
        fetchData();
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
        <h1 className="banner-title">{bannerMovie.title}</h1>
        <p className="banner-description">{bannerMovie.description}</p>
        </div>
    </div>)
  );
}

export default Banner;