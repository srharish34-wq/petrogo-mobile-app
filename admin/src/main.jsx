/**
 * Main Entry Point
 * React application initialization
 * Location: admin/src/main.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Root element
const rootElement = document.getElementById('root');

// Create and render React app
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}