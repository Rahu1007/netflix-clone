import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchContext = createContext();

export const WatchProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('watch_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watch_history', JSON.stringify(history));
  }, [history]);

  const addToWatchlist = (movie) => {
    if (!watchlist.find(m => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const addToHistory = (movie) => {
    if (!history.find(m => m.id === movie.id)) {
      setHistory(prev => [movie, ...prev].slice(0, 100)); // Keep last 100
    }
  };

  return (
    <WatchContext.Provider value={{ watchlist, history, addToWatchlist, addToHistory }}>
      {children}
    </WatchContext.Provider>
  );
};

export const useWatch = () => useContext(WatchContext);
