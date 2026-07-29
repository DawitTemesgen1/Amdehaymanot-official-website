// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'; // Make sure this path is correct
import { HelmetProvider } from 'react-helmet-async'; // <-- STEP 1: Import HelmetProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* STEP 2: Wrap your entire App with HelmetProvider */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);