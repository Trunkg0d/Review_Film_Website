// BackToTopButton.js
import React, { useState, useEffect } from 'react';
import './BackToTopButton.css';

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={isVisible ? "scroll-to-top" : undefined}>
      {isVisible && 
        <div onClick={scrollToTop}>
            <ion-icon name="arrow-up-outline"></ion-icon>
        </div>}
    </div>
  );
}

export default BackToTopButton;