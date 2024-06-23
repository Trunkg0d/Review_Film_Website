// Page.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Page.css';
import Pagination from './Pagination';
import watchlist_icon from './assets/bookmark.png';
import added_icon from './assets/bookmark-added.png';

function Page() {
    const { pagenumber } = useParams();
    const [movies, setMovies] = useState([]);
    const [numofpage, setNumOfPage] = useState(1);
    const editIconPath = '/data/edit_icon.png';
    const [userWishlist, setUserWishlist] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:8000/user/profile', {}, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUserWishlist(response.data.wish_list);
          } catch (error) {
            console.error('Error fetching user info:', error);
            if (error.response && error.response.status === 401) {
              window.location.href = '/';
            }
          }
        };
    
        fetchUserInfo();
      }, []);

    const fetchData = useCallback(() => {
        axios.get(`http://localhost:8000/movie/page/${pagenumber - 1}`)
            .then(response => {
                const formattedData = response.data.map(movie => ({
                    movie_id: movie.movie_id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date ? movie.release_date.split('T')[0] : ''
                }));
                setMovies(formattedData);
            })
            .catch(error => console.log(error.message));
    }, [pagenumber]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        axios.get('http://localhost:8000/movie/numberOfMovies')
            .then(response => {
                const totalMovies = response.data; 
                setNumOfPage(Math.ceil(totalMovies / 12));
            })
            .catch(error => console.log(error.message));
    }, []);

    const handleEditClick = (id) => {
        window.location.href = `http://localhost:3000/admin_filmconfig/${id}`;
    };
    const role = localStorage.getItem('role');

    const handleAddWishlist = (movieId) => {
        setUserWishlist(prevWishlist => [...prevWishlist, movieId]);
    };

    const handleRemoveWishlist = (movieId) => {
        setUserWishlist(prevWishlist => prevWishlist.filter(id => id !== movieId));
    };
    const showWatchlistIcon = (movieId) => {
        const isInWishlist = userWishlist.includes(movieId);
        return isInWishlist ? (
            <div className='watchlist-added' onClick={() => handleRemoveWishlist(movieId)}>
                <img src={added_icon} alt='Remove from Watchlist'/> 
            </div>
        ) : (
            <div className='add-watchlist' onClick={() => handleAddWishlist(movieId)}>
                <img src={watchlist_icon} alt='Add to Watchlist'/> 
            </div>
        );
    };

    return (
        <section id="page" className="page">
            {/* {pagenumber === '1' && <Header />} */}
            <div className="title-row">
                <h2 className="section-title">Newly updated movie page {pagenumber}</h2>
            </div>
            <div className="popular">
                {movies.map(movie => (
                    <div key={movie.movie_id} className="movie">
                        <a href={`/movie/${movie.movie_id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }}/>
                        </a>
                        {isLoggedIn && showWatchlistIcon(movie.id)}
                        {movie.release_date && <p className="movie-release-date">{movie.release_date}</p>}
                        {movie.title && <p className="movie-title">{movie.title}</p>}
                        {role === '1' && (
                            <button className="edit-button" onClick={() => handleEditClick(movie.movie_id)}>
                                <img src={editIconPath} alt="Edit" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <Pagination currentPage={pagenumber} numofpage={numofpage}/>
        </section>
    );
}

export default Page;
