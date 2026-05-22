import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Flat Structure Imports
import App from './App.jsx';
import { AuthProvider } from './AuthContext.jsx'; // Security Context (हम इसे नेक्स्ट स्टेप में बनाएंगे)
import './index.css'; // Tailwind & Custom Scrollbar

// React Root Initialization with StrictMode for error catching
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        
        {/* Advanced Glassmorphism Notification System */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 18, 51, 0.85)', // Navy Blue Glass
              color: '#FFFFFF', // Pure White text
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
              padding: '16px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#4ADE80', secondary: '#001233' }, // Green Icon
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#001233' }, // Red Icon
            },
          }}
        />
        
        {/* Main Application */}
        <App />
        
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);