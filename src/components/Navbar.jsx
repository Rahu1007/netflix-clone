import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ style }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav style={{
      ...style,
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '20px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
      transition: 'background-color var(--transition-speed)',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" style={{ color: 'var(--accent)', fontSize: '24px', fontWeight: 'bold' }}>NETFLIX</Link>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/category/tv">TV Shows</Link></li>
          <li><Link to="/category/movies">Movies</Link></li>
          <li><Link to="/category/games">Video Games</Link></li>
        </ul>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: searchOpen ? 'rgba(0,0,0,0.7)' : 'transparent', border: searchOpen ? '1px solid white' : 'none', padding: searchOpen ? '5px 10px' : '0' }}>
          <Search onClick={() => setSearchOpen(!searchOpen)} style={{ cursor: 'pointer' }} />
          {searchOpen && (
            <input 
              autoFocus
              style={{ background: 'transparent', color: 'white', marginLeft: '10px', transition: 'width 0.3s' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, people, genres..."
            />
          )}
        </form>
        <Link to="/profile"><User /></Link>
      </div>
    </nav>
  );
};

export default Navbar;
