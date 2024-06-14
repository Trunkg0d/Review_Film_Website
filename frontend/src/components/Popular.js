// Popular.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Popular.css';

function Popular() {
    const [movies, setMovies] = useState([]);

    const fetchData = () => {
        axios.get('http://localhost:8000/movie')  // Adjust the URL to your FastAPI endpoint
        .then(response => {
            const formattedData = response.data.map(movie => ({
                id: movie._id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date ? movie.release_date.split('T')[0] : ''
            }));
            setMovies(formattedData);
        })
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
