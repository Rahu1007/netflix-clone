import React, { useEffect, useState } from 'react';
import { fetchTitles } from '../api';
import InfiniteRow from '../components/InfiniteRow';
import { useParams } from 'react-router-dom';

const Home = ({ openModal }) => {
  const { type } = useParams();
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    fetchTitles({ limit: 5, type }).then(data => {
      if (data.titles && data.titles.length > 0) {
        // Find one with a backdrop to be the hero, else fallback to first
        const hero = data.titles.find(x => x.backdrop) || data.titles[0];
        setHeroMovie(hero);
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
    { title: "🔥 Trending Now", queryType: "" },
    { title: "📺 Top TV Shows", queryType: "tv" },
    { title: "🎬 Top Movies", queryType: "movies" },
    { title: "🎮 Top Video Games", queryType: "games" }
  ];

  return (
    <div className="page pb-4">
        {/* Hero Section */}
        {heroMovie ? (
          <div className="hero">
            <div className="hero-bg-img" style={{ backgroundImage: `url(${heroMovie.backdrop || heroMovie.primaryImage?.url})` }}></div>
            <div className="hero-gradient"></div>
            <div className="hero-content">
              <div className="hero-badge">🔥 Today's Top Pick</div>
              <h1 className="hero-title">{heroMovie.primaryTitle}</h1>
              <p className="hero-desc">{heroMovie.plot || "Unlimited entertainment ready for you."}</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => openModal(heroMovie)}>▶  Play Now</button>
                <button className="btn btn-secondary" onClick={() => openModal(heroMovie)}>ℹ  More Info</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100vh', background: 'var(--bg)' }}></div>
        )}

        {/* Rows */}
        <div style={{ paddingTop: '20px' }}>
           {rows.map(row => (
              <InfiniteRow 
                key={row.title} 
                title={row.title} 
                type={row.queryType} 
                openModal={openModal} 
                isGrid={false}
              />
           ))}
        </div>
    </div>
  );
};

export default Home;
