import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            boxShadow: 'var(--shadow-lg)'
          },
          success: {
            iconTheme: { primary: 'var(--emerald)', secondary: 'white' }
          },
          error: {
            iconTheme: { primary: 'var(--rose)', secondary: 'white' }
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
