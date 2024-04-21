// Header.js
import React, {useState, useEffect} from 'react';
import './Header.css';

function Header() {
  const navListData = [
    {
      _id: 1,
      link: '#',
      name: 'home',
      active: true
    },
    {
      _id: 2,
      link: '#schedule',
      name: 'schedule',
      active: false
    },
    {
      _id: 3,
      link: '#trend',
      name: 'trend',
      active: false
    },
    {
      _id: 4,
      link: '#blog',
      name: 'blog',
      active: false
    }
  ]

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <a href="/">Morevie <i className="fa-solid fa-film"></i></a>
      </div>
        <ul className="nav">
          {navListData.map(({ _id, link, name, active }) => (
            <li key={_id}>
              <a href={link} className={active ? 'active' : ''}>{name}</a>
            </li>
          ))}
        </ul>
        <div className="search">
          <input type="text" placeholder="Search..." />
          <ion-icon name="search-outline"></ion-icon>
        </div>
        <div className="signin">
          <button>Sign In</button>
        </div>
      </header>
  );
}

export default Header;