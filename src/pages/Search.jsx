import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchTitles } from '../api';
import InfiniteRow from '../components/InfiniteRow';

const Search = ({ openModal }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchTitles(query).then(data => {
        setResults(data.titles || []);
        setLoading(false);
      });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="page" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '40px' }}>
       {loading ? (
         <div style={{ textAlign: 'center', marginTop: '50px' }}>Searching...</div>
       ) : (
         <div className="section">
           <h2 className="section-title">Search Results for "{query}"</h2>
           <div className="card-row-grid" style={{ marginTop: '20px' }}>
              {results.length > 0 ? (
                results.map((item, i) => (
                  <div key={item.id + i} className="media-card grid-card" onClick={() => openModal(item)}>
                    {item.primaryImage?.url ? (
                      <img src={item.primaryImage.url} alt={item.primaryTitle} className="media-card-img" />
                    ) : (
                      <div className="lazy-placeholder"></div>
                    )}
                    <div className="media-card-info">
                      <div className="media-card-title">{item.primaryTitle}</div>
                      <div className="media-card-meta">{item.startYear}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--muted)', width: '100%', padding: '20px' }}>No results found.</div>
              )}
           </div>
         </div>
       )}
    </div>
  );
};

export default Search;
