import React, { useState } from 'react';
import './styles/animations.css';
import './styles/fonts.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import AltarBuilder from './components/AltarBuilder';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import VerifyEmail from './components/VerifyEmail';

const AppContent = () => {
  const { user, loading, logout } = useAuth();
  const { theme } = useTheme();
  const [view, setView] = useState('welcome'); // 'welcome', 'register'

  const handleLogout = () => {
    logout();
    setView('welcome');
  };

  const handleLogin = (type) => {
    // Login is now handled by the LoginModal component
    // This function might be used for other login-related functionality
  };

  const handleNavigateToRegister = () => {
    setView('register');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: theme.colors.text,
        background: theme.colors.background,
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${theme.colors.border}`,
            borderTop: `3px solid ${theme.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Loading...</span>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Always show WelcomePage as entry point
  // Use routes for navigation to admin dashboard, altar builder, etc.
  return (
    <Routes>
      <Route path="/" element={<WelcomePage onLogin={handleLogin} onRegister={handleNavigateToRegister} />} />
      <Route path="/register" element={<Register onBack={() => { window.location.href = '/'; }} />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/builder" element={user ? <AltarBuilder user={user} onLogout={handleLogout} /> : <WelcomePage onLogin={handleLogin} onRegister={handleNavigateToRegister} />} />
      <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <WelcomePage onLogin={handleLogin} onRegister={handleNavigateToRegister} />} />
      {/* fallback */}
      <Route path="*" element={<WelcomePage onLogin={handleLogin} onRegister={handleNavigateToRegister} />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;