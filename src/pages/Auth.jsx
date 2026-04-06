import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to authenticate.');
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate('/');
  };

  return (
    <div className="auth-screen page">
        <div className="auth-bg"></div>
        <div className="auth-bg-grid"></div>
        <div className="auth-card">
          <div className="auth-logo" style={{ fontSize: 24, marginBottom: 4 }}>STREAM<span>VAULT</span></div>
          <h2 className="auth-title">{isLogin ? 'Welcome back' : 'Create Account'}</h2>
          <p className="auth-subtitle">{isLogin ? 'Sign in to your account' : 'Join StreamVault for free'}</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input className="auth-field" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
              )}
              <input className="auth-field" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="auth-field" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              
              <button type="submit" className="auth-btn primary">{isLogin ? 'Sign In' : 'Create Account'}</button>
          </form>
          
          <button className="auth-btn ghost" onClick={handleGuest}>Continue as Guest</button>
          
          <div className="auth-switch">
             {isLogin ? (
                 <>No account? <span onClick={() => { setIsLogin(false); setError(''); }}>Sign up</span></>
             ) : (
                 <>Have an account? <span onClick={() => { setIsLogin(true); setError(''); }}>Sign in</span></>
             )}
          </div>
        </div>
    </div>
  );
};

export default Auth;
