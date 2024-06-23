// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Movie from './pages/Movie/Movie';
import BackToTopButton from './components/BackToTopButton';
import Footer from './components/Footer';
import LoginSignup from './components/LoginSignup/LoginSignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import SafetySetting from './pages/Dashboard/SafetySettings/safetySetting';
import ChatBox from './components/ChatBox/Chatbox';
import Page from './components/Page';
import FilmConfig from './pages/FilmConfig';
import NotFound from './pages/Errors/NotFound';
import { checkAndRemoveExpiredToken } from './utils.js';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/page/:pagenumber" element={<Page />} />
        <Route path="/admin_filmconfig/:id" element={<FilmConfig />} />
        <Route path='*' element={<NotFound />} />
        <Route path="/user/safetySettings" element={<SafetySetting/>}></Route>
      </Routes>
      <Footer />
      {isLoggedIn && <ChatBox />}
      <BackToTopButton />
    </Router>
  );
}

export default App;
