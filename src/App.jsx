import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import MovieModal from './components/MovieModal';
import { useAuth } from './context/AuthContext';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, loading } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker for offline API storage
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Random toggle offline simulator to meet assessment requirement:
    // "app will be switched to online and offline mode randomly"
    const randomToggle = setInterval(() => {
       if (Math.random() > 0.8) {
          setIsOnline(prev => !prev);
       }
    }, 30000); // Check every 30s

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(randomToggle);
    };
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      {!isOnline && (
         <div className="offline-bar">
           You are currently offline. Viewing cached content.
         </div>
      )}
      {user && <Navbar style={{ marginTop: !isOnline ? '35px' : '0' }} />}
      
      <Routes>
        <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home openModal={setSelectedMovie} /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <Search openModal={setSelectedMovie} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile openModal={setSelectedMovie} /> : <Navigate to="/login" />} />
        <Route path="/category/:type" element={user ? <Home openModal={setSelectedMovie} /> : <Navigate to="/login" />} />
      </Routes>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </BrowserRouter>
  );
}

export default App;
