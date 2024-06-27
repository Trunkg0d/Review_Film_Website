import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UploadModal from '../components/Upload/Upload';
import './FilmConfig.css';

function AddFilm() {
    const navigate = useNavigate();
    const [movie, setMovie] = useState({
        // movie_id: '',
        title: '',
        backdrop_path: '',
        poster_path: '',
        description: '',
        release_date: '2024-02-27T00:00:00',
        language: '',
        tags: [],
        runtime: '',
        average_rating: '',
        actors: [],
        director: []
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);
    const [directorSearchQuery, setDirectorSearchQuery] = useState('');
    const [directorSearchResults, setDirectorSearchResults] = useState([]);
    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        axios.post(`http://localhost:8000/movie/new`, { ...movie, actors: selectedActors, director: selectedDirectors }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                alert('Movie added successfully!');
                navigate('/'); // Redirect to movies list after addition
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCastImg = (profile_image, gender) => {
        return profile_image ? `https://image.tmdb.org/t/p/w200${profile_image}` : 
        ((gender === 'Male') ? `https://i.pinimg.com/564x/47/3e/84/473e84e35274f087695236414ff8df3b.jpg` : 
        `https://i.pinimg.com/564x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg`);
    };

    return (
        <section id="film-config" className="film-config">
            <div className="backdrop-container">
                <img 
                    src={movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 
                    'https://static.vecteezy.com/system/resources/previews/045/368/271/non_2x/a-blue-and-white-background-with-the-words-written-in-white-the-background-has-a-wave-like-pattern-giving-it-a-modern-and-artistic-feel-vector.jpg'} 
                    alt={movie.title} 
                    className="movie-backdrop" 
                />
            </div>
            <div className="config-container">
                <div className="image-section">
                    <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
                        'https://st.depositphotos.com/7916244/58857/v/450/depositphotos_588574612-stock-illustration-movie-poster-design-template-background.jpg'} 
                        alt={movie.title} 
                        className="movie-poster" 
                    />
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
                            <input type="date" name="release_date" value={movie.release_date} onChange={handleChange} />
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
                                        <img src={handleCastImg(actor.profile_image)} alt={actor.name} className="actor-image" />
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
                                            <img src={handleCastImg(result.profile_image)} alt={result.name} className="result-image" />
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
                                        <img src={handleCastImg(director.profile_image)} alt={director.name} className="director-image" />
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
                                            <img src={handleCastImg(result.profile_image)} alt={result.name} className="result-image" />
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
                        <button type="submit" className="submit-button">Add Movie</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AddFilm;
