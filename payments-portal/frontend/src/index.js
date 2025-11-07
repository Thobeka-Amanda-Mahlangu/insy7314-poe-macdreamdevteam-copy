// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
// You might need to import your styling here (e.g., if using Tailwind or Bootstrap)
import './index.css'; 
import App from './App'; 

// Use createRoot for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode helps highlight potential problems and outdated lifecycles in the app.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you have a reportWebVitals.js file (standard CRA/Vite setup), you can keep this
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();