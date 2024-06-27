import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';
import search_icon from '../assets/search.png';

function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedTag = queryParams.get('tag');

  useEffect(() => {
    axios.get('http://localhost:8000/movie/')
      .then(response => {
        const moviesData = response.data;
        setMovies(moviesData);

        const allGenres = moviesData.reduce((acc, movie) => {
          movie.tags.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []);
        setGenres(allGenres);
      })
      .catch(error => console.log(error.message));
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setSelectedGenres(prev => [...prev, selectedTag]);
    }
  }, [selectedTag]);

  const handleGenreClick = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSearch = () => {
    setFilteredMovies(
      movies.filter(movie => 
        selectedGenres.every(genre => movie.tags.includes(genre))
      )
    );
  };

  return (
    <div className="search-page">
      <div className="search-header-container">
        <div className="genre-tags">
          {genres.map((genre, index) => (
            <button 
              key={index} 
              className={selectedGenres.includes(genre) ? 'selected' : ''}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
        <img src={search_icon} className='search-icon' onClick={handleSearch} alt=''/>
      </div>
      <div className="movie-results">
        {filteredMovies.length > 0 ? (filteredMovies.map((movie, index) => (
          <div key={index} className="movie">
            <Link to={`/movie/${movie.movie_id}`} className="movie-link">
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title}/>
              <h3>{movie.title}</h3>
            </Link>
            <p>{movie.tags.join(', ')}</p>
          </div>
        ))) : (<></>)}
      </div>
    </div>
  );
}

export default SearchPage;
