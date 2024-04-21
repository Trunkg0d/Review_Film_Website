// Home.js
import React from 'react';
import './Home.css';
import Banner from '../components/Banner';
import Trending from '../components/Trending';

function Home() { 
  return (
    <div className="home">
      <Banner />
      <Trending />
    </div>
  );
}

export default Home;