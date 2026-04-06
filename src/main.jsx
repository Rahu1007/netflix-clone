import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { WatchProvider } from './context/WatchContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WatchProvider>
        <App />
      </WatchProvider>
    </AuthProvider>
  </React.StrictMode>,
)
