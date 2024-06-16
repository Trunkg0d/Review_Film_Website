// App.js
import React from 'react';
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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/user/dashboard" element={<Dashboard/>}></Route>
        <Route path="/user/safetySettings" element={<SafetySetting/>}></Route>
      </Routes>
      <Footer />
      <ChatBox/>
      <BackToTopButton />
    </Router>
  );
}

export default App;