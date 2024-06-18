// Movie.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';
import Reviews from '../../components/Review/Reviews';
import male from './assets/man.png';
import female from './assets/woman.png';

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const cast = [{
    "_id": {
      "$oid": "666b0c2500105718d9a4ad0c"
    },
    "name": "Timothée Chalamet",
    "gender": "Male",
    "born": {
      "$date": "1995-12-27T00:00:00.000Z"
    },
    "profile_image": "/a7zqw5YeN3FFHdlLFPhTpU26aOa.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad0d"
    },
    "name": "Zendaya",
    "gender": "Female",
    "born": {
      "$date": "1996-09-01T00:00:00.000Z"
    },
    "profile_image": "/nO16XkATzCZLN0biZYrL6Hhwkcz.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad0e"
    },
    "name": "Rebecca Ferguson",
    "gender": "Female",
    "born": {
      "$date": "1983-10-19T00:00:00.000Z"
    },
    "profile_image": "/lJloTOheuQSirSLXNA3JHsrMNfH.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad0f"
    },
    "name": "Javier Bardem",
    "gender": "Male",
    "born": {
      "$date": {
        "$numberLong": "-26438400000"
      }
    },
    "profile_image": "/IShnFg6ijWhpbu29dFBd9PtqQg.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad10"
    },
    "name": "Josh Brolin",
    "gender": "Male",
    "born": {
      "$date": {
        "$numberLong": "-59529600000"
      }
    },
    "profile_image": "/2WGHZaU5FUUKOgRNp23fgOfKSzU.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad11"
    },
    "name": "Austin Butler",
    "gender": "Male",
    "born": {
      "$date": "1991-08-17T00:00:00.000Z"
    },
    "profile_image": "/fpbaNWLYyZku7c5jJQMQEVnPKrs.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad12"
    },
    "name": "Florence Pugh",
    "gender": "Female",
    "born": {
      "$date": "1996-01-03T00:00:00.000Z"
    },
    "profile_image": "/6Sjz9teWjrMY9lF2o9FCo4XmoRh.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad13"
    },
    "name": "Dave Bautista",
    "gender": "Male",
    "born": {
      "$date": {
        "$numberLong": "-30067200000"
      }
    },
    "profile_image": "/sAeWLLUFEVggkLjrnkI6NiUMtLO.jpg",
    "job": [
      "Acting"
    ]
  },
  {
    "_id": {
      "$oid": "666b0c2500105718d9a4ad14"
    },
    "name": "Christopher Walken",
    "gender": "Male",
    "born": {
      "$date": {
        "$numberLong": "-844387200000"
      }
    },
    "profile_image": "/ApgDL7nudR9T2GpjCG4vESgymO2.jpg",
    "job": [
      "Acting"
    ]
  }];

  const [selectedCast, setSelectedCast] = useState(null);

  const handleMouseEnter = (castMember) => {
    setSelectedCast(castMember);
  };

  const handleMouseLeave = () => {
    setSelectedCast(null);
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/movie/${id}`)
      .then(response => {
        setMovie(response.data);
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
                      <div key={member._id.$oid} className="cast-item">
                        <div className="cast-image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w200${member.profile_image})` }} 
                            onMouseEnter={() => handleMouseEnter(member)} onMouseLeave={handleMouseLeave}>
                        </div>
                        <div className="cast-name">{member.name}</div>
                        {selectedCast && selectedCast._id.$oid === member._id.$oid && (
                          <CastDetailModal castMember={member} />
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
  
  const parseDate = (date) => {
    if (date.$date) {
      const d = new Date(date.$date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (date.$numberLong) {
      const d = new Date(parseInt(date.$numberLong, 10));
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  const getGender = (gender) => {
    if (gender === 'Male')
      return male;
    else
      return female;
  };

  return (
          <div className="cast-detail">
              <div className="avatar" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w200${castMember.profile_image})` }}/>
              <div className="info-container">
                  <div className="name">{castMember.name}</div>
                  <div className="other-container">
                    <div className="dob">{/*new Date(castMember.born.$date).toLocaleDateString()*/parseDate(castMember.born)}</div>
                    <div className="icon"><img src={getGender(castMember.gender)} alt=''/></div>
                    <div className="job">Vai trò: {castMember.job[0]}</div>
                  </div>
              </div>
          </div>
  );
}

export default Movie;
