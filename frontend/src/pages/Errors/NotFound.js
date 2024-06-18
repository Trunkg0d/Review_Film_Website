import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <img src="/data/notfound.svg" alt="Not Found" className="not-found-image" />
      <Link to="/" className="home-link">Go back to Home</Link>
    </div>
  );
}

export default NotFound;
