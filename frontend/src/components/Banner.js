// Banner.js
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react';
import './Banner.css';

function Banner() {
    const [movies, setMovies] = useState([]);
    const [bannerMovieIndex, setBannerMovieIndex] = useState(0);
    
    const fetchData = useCallback(() => {
        axios.get(`http://localhost:8000/movie`)
            .then(response => {
                const formattedData = response.data.map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    description: movie.description,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date ? movie.release_date.split('T')[0] : ''
                }));
                setMovies(formattedData);
            })
            .catch(error => console.log(error.message));
    })

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
        backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, .7)), 
                        url("https://image.tmdb.org/t/p/original/${bannerMovie.backdrop_path}")`,

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