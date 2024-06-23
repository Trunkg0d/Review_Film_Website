// Movie.jsx
import React, { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';
import Reviews from '../../components/Review/Reviews';
import male from './assets/man.png';
import female from './assets/woman.png';

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  const [selectedCast, setSelectedCast] = useState(null);

  const handleMouseEnter = (castMember) => {
    setSelectedCast(castMember);
  };

  const handleMouseLeave = () => {
    setSelectedCast(null);
  };

  const handleCastImg = (profile_image, gender) => {
    return profile_image ? `url(https://image.tmdb.org/t/p/w200${profile_image})` : 
    ((gender === 'Male') ? `url(https://i.pinimg.com/564x/47/3e/84/473e84e35274f087695236414ff8df3b.jpg)` : 
    `url(https://i.pinimg.com/564x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg)`);
  }


  useEffect(() => {
    axios.get(`http://localhost:8000/movie/${id}`)
      .then(response => {
        setMovie(response.data);
        setCast(response.data.actors)
      })
      .catch(error => console.log(error.message));
  }, [id]); // Add id as a dependency

  const getImageUrl = (path, defaultImage) => {
    return path ? `https://image.tmdb.org/t/p/w500/${path}` : defaultImage;
  };

  return (
    <>
      {
        movie && (
          <>
            <div className="movie-banner"
              style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")` }}>
            </div>
            <div className="mb-3 movie-content container">
              <div className="movie-content__poster">
                <div className="movie-content__poster__img"
                  style={{ backgroundImage: `url(${getImageUrl(movie.poster_path)})` }}>
                </div>
              </div>
              <div className="movie-content__info">
                <div className="title">
                  {movie.title}
                </div>
                <div className="genres">
                  {
                    movie.tags && movie.tags.map((tag, i) => (
                      <span key={i} className="genres__item">{tag}</span>
                    ))
                  }
                </div>
                <p className="overview">{movie.description}</p>
                <div className="cast">
                  <div className="about-cast-container">
                    <div className="about-cast">
                      Diễn viên
                    </div>
                  </div>
                  <div className="cast-container">
                    {cast.map((member, index) => (
                      <div key={member._id} className="cast-item" onMouseEnter={() => handleMouseEnter(member)} onMouseLeave={handleMouseLeave}>
                        <div className="cast-image" style={{ backgroundImage: handleCastImg(member.profile_image, member.gender) }}>
                        </div>
                        <div className="cast-name">{member.name}</div>
                        {selectedCast && selectedCast._id === member._id && (
                          <CastDetailModal castMember={member}/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
      <Reviews id={id} />
    </>
  );
}

function CastDetailModal(props) {

  const castMember = props.castMember;
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const [visible, setVisible] = useState(false);
  const delayTimeout = useRef(null);
  
  const getGender = (gender) => {
    if (gender === 'Male')
      return male;
    else
      return female;
  };

  const handleCastImg = (profile_image, gender) => {
    return profile_image ? `url(https://image.tmdb.org/t/p/w200${profile_image})` : 
    ((gender === 'Male') ? `url(https://i.pinimg.com/564x/47/3e/84/473e84e35274f087695236414ff8df3b.jpg)` : 
    `url(https://i.pinimg.com/564x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg)`);
  }

  const calculateAndSetPosition = (clientX, clientY) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const popUpWidth = 400; // Adjust based on your pop-up width (30rem)
    const popUpHeight = 200; // Adjust based on your pop-up height (15rem)

    let left = clientX + 10; // Adding some offset
    let top = clientY + 10;  // Adding some offset

    if (left + popUpWidth > windowWidth) {
        left = clientX - popUpWidth - 10;
    }

    if (top + popUpHeight > windowHeight) {
        top = clientY - popUpHeight - 10;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      calculateAndSetPosition(e.clientX, e.clientY);

      if (!visible){
        if (delayTimeout.current) {
          clearTimeout(delayTimeout.current);
        }

        delayTimeout.current = setTimeout(() => {
          setVisible(true);
        }, 20); 
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (delayTimeout.current) {
          clearTimeout(delayTimeout.current);
      }
    };
  }, [visible]);

    return (
        visible && (
          <div className="cast-detail" style={{ top:`${position.top}px`, left:`${position.left}px` }}>
            <div className="avatar" style={{ backgroundImage: handleCastImg(castMember.profile_image, castMember.gender)}}/>
            <div className="info-container">
              <div className="name">{castMember.name}</div>
              <div className="other-container">
                <div className="dob">{castMember.born}</div>
                <div className="icon"><img src={getGender(castMember.gender)} alt=''/></div>
                <div className="job">Role: {castMember.job[0]}</div>
              </div>
            </div>
          </div>)
  );
}

export default Movie;
