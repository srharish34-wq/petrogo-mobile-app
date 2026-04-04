/**
 * Main Entry Point
 * React application entry point
 * Location: bunk/src/main.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/bunkcomplete.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);