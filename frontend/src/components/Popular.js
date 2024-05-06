// Popular.js
import React, { useEffect, useState } from 'react';
import './Popular.css';

function Popular() {
    const [movies, setMovies] = useState([]);

    const fetchData = () => {
        fetch('http://localhost:3000/data/movies_data.json')
        .then(response => response.json())
        .then(data => setMovies(data))
        .catch(error => console.log(error.message));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section id="popular" className="popular">
            <div className="title-row">
                <h2 className="section-title">Popular</h2>
            </div>
            <div className="popular">
                {movies.slice(0, 20).map(movie => (
                <div key={movie.id} className="movie">
                    <a href={`/movie/${movie.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }} />
                    </a>
                    {(movie.release_date) && <p className="movie-release-date">{movie.release_date}</p>}
                    {(movie.title) && <p className="movie-title">{movie.title}</p>}
                </div>
                ))}
            </div>
        </section>
    );
}

export default Popular;