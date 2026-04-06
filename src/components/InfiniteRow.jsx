import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchTitles } from '../api';
import { motion } from 'framer-motion';

const InfiniteRow = ({ title, type, openModal }) => {
  const [items, setItems] = useState([]);
  const [pageToken, setPageToken] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [loading, setLoading] = useState(false);

  // To prevent memory leak, only show a window of items or use native smooth scroll
  const scrollRef = useRef(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchTitles({ limit: 50, pageToken, type });
      setItems(prev => {
         // Deduplicate items to prevent key issues
         const newItems = data.titles.filter(t => !prev.find(p => p.id === t.id));
         return [...prev, ...newItems].slice(0, 1000); // 10k items might crash standard DOM, slicing to 1000 or 100 per row.
      });
      if (data.nextPageToken) {
        setPageToken(data.nextPageToken);
      } else {
        setHasMore(false);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  useEffect(() => {
      loadMore();
  }, [type]); // initial load

  return (
    <div style={{ margin: '20px 0', padding: '0 40px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '10px' }}>{title}</h2>
      <div 
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '10px',
          paddingBottom: '20px',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, i) => {
          const imgUrl = item.primaryImage?.url || 'https://via.placeholder.com/300x450/141414/ffffff?text=No+Image';
          return (
            <motion.div
              key={item.id + i}
              whileHover={{ scale: 1.05 }}
              style={{
                flex: '0 0 auto',
                width: '200px',
                height: '300px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative'
              }}
              onClick={() => openModal(item)}
            >
              <img 
                src={imgUrl} 
                alt={item.primaryTitle} 
                loading="lazy"
                onError={(e) => { e.target.src = 'https://placehold.co/300x450/2f2f2f/FFF?text=No+Image' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          );
        })}
        {hasMore && (
           <div ref={ref} style={{ flex: '0 0 auto', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {loading && <div style={{ color: 'white' }}>...</div>}
           </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(InfiniteRow);
