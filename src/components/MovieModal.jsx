import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Plus, ThumbsUp } from 'lucide-react';
import { useWatch } from '../context/WatchContext';

const MovieModal = ({ movie, onClose }) => {
  const { addToWatchlist, addToHistory } = useWatch();

  if (!movie) return null;

  // Add to history automatically when opened
  useEffect(() => {
    addToHistory(movie);
  }, [movie]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          background: 'var(--bg-color)',
          width: '90%',
          maxWidth: '850px',
          maxHeight: '90vh',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <button 
           onClick={onClose}
           style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: '#181818', color: 'white', borderRadius: '50%', padding: '8px' }}>
           <X />
        </button>
        
        <div style={{ height: '50vh', position: 'relative', backgroundImage: `url(${movie.primaryImage?.url})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }}></div>
            <div style={{ position: 'absolute', bottom: '20px', left: '40px', display: 'flex', gap: '15px' }}>
               <button style={{ padding: '10px 30px', fontSize: '18px', fontWeight: 'bold', backgroundColor: 'white', color: 'black', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Play fill="black" /> Play
               </button>
               <button 
                  onClick={() => addToWatchlist(movie)}
                  style={{ border: '2px solid rgba(255,255,255,0.7)', padding: '10px', borderRadius: '50%', color: 'white' }}>
                 <Plus />
               </button>
               <button style={{ border: '2px solid rgba(255,255,255,0.7)', padding: '10px', borderRadius: '50%', color: 'white' }}>
                 <ThumbsUp />
               </button>
            </div>
        </div>

        <div style={{ padding: '40px', display: 'flex', gap: '40px', overflowY: 'auto', maxHeight: '40vh' }}>
            <div style={{ flex: 2 }}>
               <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ color: '#46d369', fontWeight: 'bold' }}>{movie.rating?.aggregateRating ? `${movie.rating.aggregateRating * 10}% Match` : 'New'}</span>
                  <span>{movie.startYear}</span>
                  <span style={{ border: '1px solid #777', padding: '0 5px' }}>{movie.type?.toUpperCase()}</span>
               </div>
               <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>{movie.primaryTitle}</h2>
               <p style={{ lineHeight: '1.6', fontSize: '16px' }}>{movie.plot || "Detailed plot not available at the moment."}</p>
            </div>
            <div style={{ flex: 1, color: '#aaa', fontSize: '14px' }}>
                <p style={{ marginBottom: '10px' }}><b style={{ color: '#777' }}>Genres:</b> {movie.genres?.join(', ') || 'N/A'}</p>
                <p><b style={{ color: '#777' }}>Votes:</b> {movie.rating?.voteCount?.toLocaleString() || 'N/A'}</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieModal;
