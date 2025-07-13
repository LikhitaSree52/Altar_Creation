import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e6e3 0%, #f5f3ef 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <h1 style={{
        color: '#5a4a2c',
        marginBottom: 8,
        fontWeight: 600,
        letterSpacing: 1,
        fontSize: 36,
      }}>
        🕯️ Welcome to Altar Builder
      </h1>
      <p style={{ color: '#7a6f57', marginBottom: 32, fontSize: 18 }}>
        Create a beautiful virtual altar in memory of your loved ones.
      </p>
      <button
        style={{
          padding: '16px 40px',
          fontSize: 20,
          borderRadius: 12,
          background: '#e0ddd7',
          color: '#5a4a2c',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(80,60,20,0.08)',
        }}
        onClick={() => navigate('/altar')}
      >
        Create Altar
      </button>
    </div>
  );
} 