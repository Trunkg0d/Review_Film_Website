import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UploadModal from '../components/Upload/Upload'; 
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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);
    const [directorSearchQuery, setDirectorSearchQuery] = useState('');
    const [directorSearchResults, setDirectorSearchResults] = useState([]);
    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchData = useCallback(() => {
        axios.get(`http://localhost:8000/movie/${id}`)
            .then(response => {
                setMovie(response.data);
                setOriginalMovie(response.data);
                setSelectedActors(response.data.actors || []);
                setSelectedDirectors(response.data.director || []);
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
        axios.put(`http://localhost:8000/movie/${id}`, { ...movie, actors: selectedActors, director: selectedDirectors }, {
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
        setSelectedActors(originalMovie.actors || []);
        setSelectedDirectors(originalMovie.director || []);
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:8000/movie/${id}`)
            .then(response => {
                alert('Movie deleted successfully!');
                navigate('/movies'); // Redirect to movies list after deletion
            })
            .catch(error => console.log(error.message));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim()) {
            axios.get(`http://localhost:8000/celebrity/search/${e.target.value.trim()}`)
                .then(response => {
                    setSearchResults(response.data);
                })
                .catch(error => console.log(error.message));
        } else {
            setSearchResults([]);
        }
    };

    const handleDirectorSearchChange = (e) => {
        setDirectorSearchQuery(e.target.value);
        if (e.target.value.trim()) {
            axios.get(`http://localhost:8000/celebrity/search/${e.target.value.trim()}`)
                .then(response => {
                    setDirectorSearchResults(response.data);
                })
                .catch(error => console.log(error.message));
        } else {
            setDirectorSearchResults([]);
        }
    };

    const handleAddActor = (actor) => {
        setSelectedActors(prevActors => [...prevActors, actor]);
    };

    const handleRemoveActor = (actorId) => {
        setSelectedActors(prevActors => prevActors.filter(actor => actor._id !== actorId));
    };

    const handleAddDirector = (director) => {
        setSelectedDirectors(prevDirectors => [...prevDirectors, director]);
    };

    const handleRemoveDirector = (directorId) => {
        setSelectedDirectors(prevDirectors => prevDirectors.filter(director => director._id !== directorId));
    };

    
  // UploadModal function
  const openModal = () => {
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

    return (
        <section id="film-config" className="film-config">
            <div className="backdrop-container">
                {/* <h2>{"Movie Backdrop"}</h2> */}
                <img src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`} alt={movie.title} className="movie-backdrop" />
            </div>
            <div className="config-container">            
                <div className="image-section">
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="movie-poster" />
                    <button onClick={openModal}>Open Upload Modal</button>
                    {isModalOpen && <UploadModal onClose={closeModal} />}
                    <div className="movie-info">
                        <h2>{movie.title}</h2>
                        <p><strong>Description:</strong> {movie.description}</p>
                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                        <p><strong>Language:</strong> {movie.language}</p>
                        <p><strong>Actors:</strong> {selectedActors.map(actor => actor.name).join(', ')}</p>
                        <p><strong>Directors:</strong> {selectedDirectors.map(director => director.name).join(', ')}</p>
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
                            <label>Actors:</label>
                            <div className="selected-actors">
                                {selectedActors.map(actor => (
                                    <div key={actor._id} className="selected-actor">
                                        <img src={`https://image.tmdb.org/t/p/w500/${actor.profile_image}`} alt={actor.name} className="actor-image" />
                                        <span>{actor.name}</span>
                                        <button type="button" onClick={() => handleRemoveActor(actor._id)}>x</button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for actors..."
                            />
                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map(result => (
                                        <div key={result._id} className="search-result" onClick={() => handleAddActor(result)}>
                                            <img src={`https://image.tmdb.org/t/p/w500/${result.profile_image}`} alt={result.name} className="result-image" />
                                            <span>{result.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Directors:</label>
                            <div className="selected-directors">
                                {selectedDirectors.map(director => (
                                    <div key={director._id} className="selected-director">
                                        <img src={`https://image.tmdb.org/t/p/w500/${director.profile_image}`} alt={director.name} className="director-image" />
                                        <span>{director.name}</span>
                                        <button type="button" onClick={() => handleRemoveDirector(director._id)}>x</button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                name="directorSearch"
                                value={directorSearchQuery}
                                onChange={handleDirectorSearchChange}
                                placeholder="Search for directors..."
                            />
                            {directorSearchResults.length > 0 && (
                                <div className="search-results">
                                    {directorSearchResults.map(result => (
                                        <div key={result._id} className="search-result" onClick={() => handleAddDirector(result)}>
                                            <img src={`https://image.tmdb.org/t/p/w500/${result.profile_image}`} alt={result.name} className="result-image" />
                                            <span>{result.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
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
