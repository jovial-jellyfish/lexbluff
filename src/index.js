// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
 
window.onerror = function(msg) {
  document.getElementById('root').innerHTML = '<div style="color:white;padding:2rem;font-family:monospace"><h2>Error:</h2><pre>' + msg + '</pre></div>';
};
 
window.onunhandledrejection = function(event) {
  document.getElementById('root').innerHTML = '<div style="color:white;padding:2rem;font-family:monospace"><h2>Promise Error:</h2><pre>' + event.reason + '</pre></div>';
};
 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 