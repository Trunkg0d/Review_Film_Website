import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';
import { SearchBar } from './Search/SearchBar';
import { SearchResultsList } from './Search/SearchResultsList';
import user_icon from './LoginSignup/assets/user.png';

function Header() {
  const navListData = [
    {
      _id: 1,
      link: '#',
      name: 'home',
      active: true
    },
    {
      _id: 2,
      link: '#schedule',
      name: 'schedule',
      active: false
    },
    {
      _id: 3,
      link: '#trend',
      name: 'trend',
      active: false
    },
    {
      _id: 4,
      link: '#blog',
      name: 'blog',
      active: false
    }
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [valueName, setValueName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY;
      setIsScrolled(scrollPos > 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // !! converts the token to a boolean

    if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.post('http://localhost:8000/user/profile', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserAvatar(response.data.img);
        } catch (error) {
          console.error('Error fetching user profile', error);
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleImageUser = (imgPath) => {
    return (imgPath === null || imgPath === 'string') ? user_icon : `http://localhost:8000/user/image/${imgPath}`;
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <a href="/">Morevie <i className="fa-solid fa-film"></i></a>
      </div>
      <ul className="nav">
        {navListData.map(({ _id, link, name, active }) => (
          <li key={_id}>
            <a href={link} className={active ? 'active' : ''}>{name}</a>
          </li>
        ))}
      </ul>
      <div className='search-container'>
        <SearchBar setResults={setResults} setValueName={setValueName}/>
        <SearchResultsList results={results} valueName={valueName}/>
      </div>
      <div className="signin">
        {isLoggedIn ? (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/user/dashboard';
            }}
          >
            <img src={handleImageUser(userAvatar)} alt="User Avatar" className="avatar" />
          </button>
        ) : (
          <button 
            type="button"
            className="signin-btn"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/login';
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
