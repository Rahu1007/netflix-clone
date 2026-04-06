import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, signup, loginAsGuest } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to guest mode if Firebase hasn't been configured properly by user
      if (err.message.includes('API key not valid') || err.message.includes('auth/')) {
        console.warn("Firebase Auth Error, fallback to Guest");
        loginAsGuest();
      }
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundImage: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg")',
      backgroundSize: 'cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)'
      }}></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(0,0,0,0.75)',
          padding: '60px 68px 40px',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '450px',
          zIndex: 10
        }}
      >
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '28px', fontWeight: 'bold' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h1>
        {error && <div style={{ background: '#e87c03', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error} - using guest mode if api key invalid</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '16px 20px', borderRadius: '4px', background: '#333', color: 'white', fontSize: '16px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '16px 20px', borderRadius: '4px', background: '#333', color: 'white', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '16px', background: 'var(--accent)', color: 'white', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', marginTop: '24px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ color: '#737373' }}>or</span>
        </div>

        <button 
          onClick={loginAsGuest}
          style={{ width: '100%', padding: '16px', background: 'white', color: 'black', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', marginTop: '20px' }}>
          Sign In as Guest
        </button>

        <p style={{ color: '#737373', marginTop: '16px' }}>
          {isLogin ? 'New to Netflix?' : 'Already have an account?'}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'white', cursor: 'pointer', marginLeft: '5px' }}>
            {isLogin ? 'Sign up now.' : 'Sign in here.'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
