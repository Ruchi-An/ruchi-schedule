import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';  // ← ここで読み込む

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
