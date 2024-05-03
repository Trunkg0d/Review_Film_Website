// Trending.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Trending.css';

function Trending() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('https://api.themoviedb.org/3/trending/all/day?api_key=062df5711fbb408fac7c50d0c4bed4a7')
        .then(response => {
            setMovies(response.data.results);
        });
    }, []);

    return (
        <section id="trending" className="trending">
            <div className="title-row">
                <h2 className="section-title">Trending</h2>
            </div>
            <div className="trending">
                {movies.map(movie => (
                <div key={movie.id} className="movie">
                    <a href={`/movie/${movie.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }} />
                    </a>
                    {(movie.release_date || movie.first_air_date) && <p className="movie-release-date">{movie.release_date || movie.first_air_date}</p>}
                    {(movie.title || movie.name) && <p className="movie-title">{movie.title || movie.name}</p>}
                </div>
                ))}
            </div>
        </section>
    );
}

export default Trending;