import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Popular.css';
import Pagination from './Pagination';

function Popular() {
    const [movies, setMovies] = useState([]);
    const [numofpage, setNumOfPage] = useState(1);

    const editIconPath = '/data/edit_icon.png';

    const fetchData = () => {
        axios.get('http://localhost:8000/movie/page/0')  // Adjust the URL to your FastAPI endpoint
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

    useEffect(() => {
        axios.get('http://localhost:8000/movie/numberOfMovies')
            .then(response => {
                const totalMovies = response.data; // Adjust this according to your API response
                setNumOfPage(Math.ceil(totalMovies / 5));
            })
            .catch(error => console.log(error.message));
    }, []);

    const handleEditClick = (id) => {
        window.location.href = `http://localhost:3000/admin_filmconfig/${id}`;
    };

    // Get the role from localStorage
    const role = localStorage.getItem('role');

    return (
        <section id="popular" className="popular">
            <div className="title-row">
                <h2 className="section-title">Popular</h2>
            </div>
            <div className="popular">
                {movies.slice(0, 12).map(movie => (
                    <div key={movie.id} className="movie">
                        <a href={`/movie/${movie.id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }} />
                        </a>
                        {(movie.release_date) && <p className="movie-release-date">{movie.release_date}</p>}
                        {(movie.title) && <p className="movie-title">{movie.title}</p>}
                        {role === '1' && (
                            <button className="edit-button" onClick={() => handleEditClick(movie.id)}>
                                <img src={editIconPath} alt="Edit" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <Pagination currentPage={1} numofpage={numofpage}/>
        </section>
    );
}

export default Popular;
