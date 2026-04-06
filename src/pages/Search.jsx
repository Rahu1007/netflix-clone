import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchTitles } from '../api';
import { motion } from 'framer-motion';

const Search = ({ openModal }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce is implicit if it comes from Navbar enter press, but if typing directly:
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setLoading(true);
        searchTitles(query).then(data => {
            setResults(data.titles || []);
            setLoading(false);
        }).catch(() => setLoading(false));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={{ padding: '100px 40px', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Search Results for: {query}</h2>
      {loading ? <p>Loading...</p> : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {results.map((item, i) => (
            <motion.div
              key={item.id + i}
              whileHover={{ scale: 1.05 }}
              onClick={() => openModal(item)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={item.primaryImage?.url || 'https://placehold.co/300x450/2f2f2f/FFF?text=No+Image'} 
                alt={item.primaryTitle} 
                onError={(e) => { e.target.src = 'https://placehold.co/300x450/2f2f2f/FFF?text=No+Image' }}
                style={{ width: '100%', borderRadius: '4px', height: '300px', objectFit: 'cover' }}
              />
              <p style={{ marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>{item.primaryTitle}</p>
            </motion.div>
          ))}
          {results.length === 0 && <p>No results found.</p>}
        </div>
      )}
    </div>
  );
};

export default Search;
