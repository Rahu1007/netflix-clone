import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const links = [
    { id: '/', label: 'Home' },
    { id: '/category/movies', label: 'Movies' },
    { id: '/category/tv', label: 'TV Shows' },
    { id: '/category/games', label: 'Video Games' }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" style={{ textDecoration: 'none' }} className="navbar-logo">
        STREAM<span>VAULT</span>
      </Link>
      <div className="nav-links" style={{ display: 'none' }}>
        {/* On mobile we hide, but for desktop we show links */}
      </div>
      <div className="nav-links" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
        {links.map(l => (
          <Link key={l.id} to={l.id} className={`nav-link ${location.pathname === l.id ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            {l.label}
          </Link>
        ))}
      </div>
      
      <div className="navbar-right">
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '0 10px' }}>
            <button type="submit" className="search-btn" title="Search">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
            </svg>
            </button>
            <input 
              type="text" 
              placeholder="Titles, people, genres" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', padding: '5px', width: '120px', outline: 'none' }}
            />
        </form>

        {user ? (
          <Link to="/profile" className="profile-btn" title="Profile" style={{ textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>
              {(user.email || 'G')[0].toUpperCase()}
            </div>
          </Link>
        ) : (
          <Link to="/login" className="nav-link active" style={{ textDecoration: 'none' }}>Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
