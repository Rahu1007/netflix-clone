import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchTitles } from '../api';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';

const InfiniteRow = ({ title, type, openModal, isGrid }) => {
  const [items, setItems] = useState([]);
  const [pageToken, setPageToken] = useState('1');
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [loading, setLoading] = useState(false);
  const { watchlist, addToWatchlist, history, addToHistory } = useWatch();
  const { user } = useAuth();

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchTitles({ limit: 20, pageToken, type });
      if (data.titles.length === 0) { setHasMore(false); setLoading(false); return; }
      setItems(prev => {
         const newItems = data.titles.filter(t => !prev.find(p => p.id === t.id));
         return [...prev, ...newItems].slice(0, 1000);
      });
      if (data.nextPageToken) setPageToken(data.nextPageToken);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { if (inView) loadMore(); }, [inView]);
  useEffect(() => { loadMore(); }, [type]);

  const typeClass = { movie: 'movie', tv: 'tv', game: 'game' };
  const typeLabel = { movie: 'Film', tv: 'Series', game: 'Game' };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className={isGrid ? "card-row-grid" : "card-row"}>
        {items.map((item, i) => {
          const inWL = watchlist.find(x => x.id === item.id);
          const tClass = typeClass[item.type] || 'movie';
          const tLabel = typeLabel[item.type] || item.type;
          return (
            <div key={item.id + i} className={`media-card ${isGrid ? 'grid-card' : ''}`} onClick={() => { addToHistory(item); openModal(item); }}>
              {item.primaryImage?.url ? (
                <img src={item.primaryImage.url} alt={item.primaryTitle} className="media-card-img" />
              ) : (
                <div className="lazy-placeholder"></div>
              )}
              <span className={`type-badge ${tClass}`}>{tLabel}</span>
              {item.rating?.aggregateRating && <span className="rating-badge">★ {item.rating.aggregateRating}</span>}
              <div className="media-card-info">
                <div className="media-card-title">{item.primaryTitle}</div>
                <div className="media-card-meta">{item.startYear}</div>
                <div className="media-card-actions">
                  <button className={`card-action-btn ${inWL ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); addToWatchlist(item); }} title="Add to watchlist">
                    {inWL ? '✓' : '＋'}
                  </button>
                  <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); addToHistory(item); openModal(item); }}>▶</button>
                </div>
              </div>
            </div>
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
