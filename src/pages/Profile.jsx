import React from 'react';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const Profile = ({ openModal }) => {
  const { watchlist, history } = useWatch();
  const { user, logout } = useAuth();

  const renderGrid = (title, items) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{title}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {items.map((item, i) => (
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
          </motion.div>
        ))}
        {items.length === 0 && <p style={{ color: '#777' }}>Nothing here yet.</p>}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '100px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 style={{ fontSize: '36px' }}>Profile</h1>
            <p style={{ color: '#aaa' }}>Signed in as: {user?.email}</p>
         </div>
         <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--card-bg)', padding: '10px 20px', borderRadius: '4px', color: 'white' }}>
            <LogOut size={18} /> Sign Out
         </button>
      </div>

      {renderGrid('My Watchlist', watchlist)}
      {renderGrid('Watch History', history)}
    </div>
  );
};

export default Profile;
