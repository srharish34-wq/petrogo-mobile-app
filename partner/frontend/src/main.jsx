/**
 * Main Entry Point
 * React application entry point
 * Location: partner/src/main.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);