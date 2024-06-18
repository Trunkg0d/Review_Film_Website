import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FilmConfig.css';

function FilmConfig() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({
        title: '',
        backdrop_path: '',
        poster_path: '',
        description: '',
        release_date: '',
        language: '',
        tags: [],
        runtime: '',
        average_rating: '',
        actors: [],
        director: []
    });
    const [originalMovie, setOriginalMovie] = useState(null);

    const fetchData = useCallback(() => {
        axios.get(`http://localhost:8000/movie/${id}`)
            .then(response => {
                setMovie(response.data);
                setOriginalMovie(response.data);
            })
            .catch(error => console.log(error.message));
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie(prevState => ({
            ...prevState,
            [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value
        }));
    };

    const token = localStorage.getItem('accessToken');
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/movie/${id}`, movie, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
            .then(response => {
                alert('Movie updated successfully!');
            })
            .catch(error => console.log(error.message));
    };

    const handleReset = () => {
        setMovie(originalMovie);
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:8000/movie/${id}`)
            .then(response => {
                alert('Movie deleted successfully!');
                navigate('/movies'); // Redirect to movies list after deletion
            })
            .catch(error => console.log(error.message));
    };

    return (
        <section id="film-config" className="film-config">
            <div className="config-container">
                <div className="image-section">
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="movie-poster" />
                    <div className="movie-info">
                        <h2>{movie.title}</h2>
                        <p><strong>Description:</strong> {movie.description}</p>
                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                        <p><strong>Language:</strong> {movie.language}</p>
                        <p><strong>Actors:</strong> {movie.actors.map(actor => actor.name).join(', ')}</p>
                        <p><strong>Directors:</strong> {movie.director.map(director => director.name).join(', ')}</p>
                    </div>
                </div>
                <div className="info-section">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title:</label>
                            <input type="text" name="title" value={movie.title} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Backdrop Path:</label>
                            <input type="text" name="backdrop_path" value={movie.backdrop_path} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Poster Path:</label>
                            <input type="text" name="poster_path" value={movie.poster_path} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea name="description" value={movie.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Release Date:</label>
                            <input type="date" name="release_date" value={movie.release_date.split('T')[0]} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Language:</label>
                            <input type="text" name="language" value={movie.language} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Tags:</label>
                            <input type="text" name="tags" value={movie.tags.join(', ')} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Runtime (minutes):</label>
                            <input type="number" name="runtime" value={movie.runtime} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Director</label>
                            <input type="text" name="runtime" value={movie.director} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Actors</label>
                            <input type="text" name="runtime" value={movie.actors} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Average Rating:</label>
                            <input type="number" step="0.1" name="average_rating" value={movie.average_rating} onChange={handleChange} />
                        </div>
                        <button type="submit" className="submit-button">Update Movie</button>
                        <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
                        <button type="button" className="delete-button" onClick={handleDelete}>Delete Movie</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default FilmConfig;
