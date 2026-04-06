import React from 'react';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = ({ openModal }) => {
  const { watchlist, history } = useWatch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h2>Please Sign In to view your profile</h2>
        <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="profile-screen page">
        <div className="profile-header">
          <div className="profile-avatar">
            {(user.email || 'G')[0].toUpperCase()}
          </div>
          <div>
            <div className="profile-name">{user.email === '__guest__' || user.uid === 'guest' ? 'Guest User' : user.displayName || 'Current User'}</div>
            <div className="profile-email" style={{ fontFamily: 'var(--font-body)', opacity: 0.7 }}>{user.email}</div>
          </div>
          <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => { logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>

        <div className="section" style={{ padding: 0 }}>
           <h2 className="section-title">📌 Watchlist <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400 }}>({watchlist.length})</span></h2>
           {watchlist.length > 0 ? (
              <div className="card-row-grid" style={{ marginTop: '20px' }}>
                {watchlist.map((item, i) => (
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
                ))}
              </div>
           ) : (
              <div className="profile-empty-state" style={{ marginTop: '20px' }}>No items in your watchlist yet. Browse and click ＋ to add.</div>
           )}
        </div>

        <div className="section" style={{ padding: 0, marginTop: '40px' }}>
           <h2 className="section-title">📺 Watch History <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400 }}>({history.length})</span></h2>
           {history.length > 0 ? (
              <div className="card-row-grid" style={{ marginTop: '20px' }}>
                {history.map((item, i) => (
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
                ))}
              </div>
           ) : (
              <div className="profile-empty-state" style={{ marginTop: '20px' }}>No watch history yet. Click on any title to start tracking.</div>
           )}
        </div>
    </div>
  );
};

export default Profile;
