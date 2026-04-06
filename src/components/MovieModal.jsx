import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';

const MovieModal = ({ item, closeModal }) => {
  const { watchlist, addToWatchlist, history, addToHistory } = useWatch();
  const { user } = useAuth();
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!item) return null;

  const inWL = watchlist.find(x => x.id === item.id);
  const isWatched = history.find(x => x.id === item.id);

  const tLabel = { movie: 'Movie', tv: 'TV Series', game: 'Video Game' }[item.type] || item.type;

  return (
    <AnimatePresence>
      <div className="modal-overlay open" onClick={(e) => { if(e.target.className.includes('modal-overlay')) closeModal(); }}>
        <motion.div 
          className="modal"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-hero">
            <img 
               src={item.backdrop || item.primaryImage?.url || "https://placehold.co/800x400/1c1c26/FFF?text=No+Backdrop"} 
               alt={item.primaryTitle} 
               className="modal-hero-img" 
            />
            <div className="modal-hero-grad"></div>
            <button className="modal-close" onClick={closeModal}>✕</button>
          </div>
          
          <div className="modal-content">
            <h2 className="modal-title">{item.primaryTitle}</h2>
            <div className="modal-badges">
              {item.startYear && <span className="badge badge-year">{item.startYear}</span>}
              {item.rating?.aggregateRating && <span className="badge badge-rating">★ {item.rating.aggregateRating}</span>}
              <span className="badge badge-genre">{tLabel}</span>
            </div>
            
            <p className="modal-desc">{item.plot || 'No description available for this title.'}</p>
            
            <div className="modal-actions">
               <button className="btn btn-primary">▶  Play</button>
               <button 
                  className="btn btn-secondary" 
                  onClick={() => addToWatchlist(item)}
               >
                  {inWL ? '✓ In Watchlist' : '＋ Watchlist'}
               </button>
               <button 
                  className="btn btn-secondary" 
                  onClick={() => addToHistory(item)}
               >
                  {isWatched ? '📺 Watched' : '📺 Mark as Watched'}
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MovieModal;
