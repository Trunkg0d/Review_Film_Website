// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Movie from './components/Movie';
import BackToTopButton from './components/BackToTopButton';
import Footer from './components/Footer';
import LoginSignup from './components/LoginSignup/LoginSignUp';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
      <Footer />
      <BackToTopButton />
    </Router>
  );
}

export default App;