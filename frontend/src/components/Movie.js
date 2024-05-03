// Movie.js
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import axios from 'axios';

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=062df5711fbb408fac7c50d0c4bed4a7`)
      .then(response => {
        setMovie(response.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{movie.title || movie.name}</h1>
      <p>{movie.overview}</p>
      <div>
        {reviews.map(review => (
          <div key={review.id}>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movie;