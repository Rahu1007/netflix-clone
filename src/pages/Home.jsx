import React, { useEffect, useState } from 'react';
import { fetchTitles } from '../api';
import Navbar from '../components/Navbar';
import InfiniteRow from '../components/InfiniteRow';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';

const Home = ({ openModal }) => {
  const { type } = useParams(); // undefined = home, 'tv' = TV shows, 'movies' = Movies, 'games' = Video Games
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    // Fetch today's top show based on category or general
    fetchTitles({ limit: 1, type }).then(data => {
      if (data.titles && data.titles.length > 0) {
        setHeroMovie(data.titles[0]);
      }
    });
  }, [type]);

  const rows = type === 'tv' ? [
    { title: "Trending TV Shows", queryType: "tv" }
  ] : type === 'movies' ? [
    { title: "Trending Movies", queryType: "movies" }
  ] : type === 'games' ? [
    { title: "Top Video Games", queryType: "games" }
  ] : [
    { title: "Trending Now", queryType: "" },
    { title: "Top TV Shows", queryType: "tv" },
    { title: "Top Movies", queryType: "movies" }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Hero Section */}
        {heroMovie && (
          <div style={{
            height: '80vh',
            width: '100vw',
            position: 'relative',
            backgroundImage: `url(${heroMovie.primaryImage?.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '40px'
          }}>
             <div style={{
               position: 'absolute',
               bottom: 0,
               left: 0,
               right: 0,
               background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)',
               height: '50%'
             }}></div>
             <div style={{
               position: 'absolute',
               bottom: '10%',
               left: '40px',
               width: '80%',
               maxWidth: '800px'
             }}>
               <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>{heroMovie.primaryTitle}</h1>
               <p style={{ fontSize: '18px', marginTop: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                 {heroMovie.plot || "No plot available for this title."}
               </p>
               <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                 <button 
                  onClick={() => openModal(heroMovie)}
                  style={{
                   padding: '10px 30px',
                   fontSize: '18px',
                   fontWeight: 'bold',
                   backgroundColor: 'white',
                   color: 'black',
                   borderRadius: '4px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '10px'
                 }}>
                   Play
                 </button>
                 <button 
                   onClick={() => openModal(heroMovie)}
                   style={{
                   padding: '10px 30px',
                   fontSize: '18px',
                   fontWeight: 'bold',
                   backgroundColor: 'rgba(109, 109, 110, 0.7)',
                   color: 'white',
                   borderRadius: '4px'
                 }}>
                   More Info
                 </button>
               </div>
             </div>
          </div>
        )}

        {/* Rows */}
        <div style={{ paddingBottom: '40px' }}>
           {rows.map(row => (
              <InfiniteRow 
                key={row.title} 
                title={row.title} 
                type={row.queryType} 
                openModal={openModal} 
              />
           ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
