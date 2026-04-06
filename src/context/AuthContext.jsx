import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";

// Config using environment variables, fallback to dummy
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey1234567890",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "netflix-clone.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "netflix-clone",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "netflix-clone.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

let app;
let auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch(e) {
  console.log("Firebase init error, using mock", e);
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try local storage for guest
    const guest = localStorage.getItem('guest_user');
    if (guest) {
      setUser({ uid: 'guest', email: 'Guest User' });
      setLoading(false);
      return;
    }
    if (auth) {
      return onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
     if (auth) return signInWithEmailAndPassword(auth, email, password);
     return Promise.resolve();
  };
  
  const signup = (email, password) => {
     if (auth) return createUserWithEmailAndPassword(auth, email, password);
     return Promise.resolve();
  };

  const loginAsGuest = () => {
    localStorage.setItem('guest_user', 'true');
    setUser({ uid: 'guest', email: 'Guest User' });
  };

  const logout = () => {
    localStorage.removeItem('guest_user');
    setUser(null);
    if (auth) return fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginAsGuest, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
