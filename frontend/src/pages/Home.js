// Home.js
import React from 'react';
import './Home.css';
import Banner from '../components/Banner';
import Popular from '../components/Popular';

function Home() { 
  return (
    <div className="home">
      <Banner />
      <Popular />
    </div>
  );
}

export default Home;