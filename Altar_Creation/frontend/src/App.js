import React, { useState, useEffect } from 'react';
import './styles/animations.css';
import './styles/fonts.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import AltarBuilder from './components/AltarBuilder';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import VerifyEmail from './components/VerifyEmail';
import LoginModal from './components/LoginModal';

const AppContent = () => {
  const { user, loading, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleRegister = () => {
    navigate('/register');
  };
  
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate('/builder');
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

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme.colors.background,
        color: theme.colors.text
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <WelcomePage 
              onLogin={handleLogin} 
              onRegister={handleRegister} 
              user={user}
            />
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onBack={() => navigate('/')} />
            )
          } 
        />
        <Route 
          path="/verify-email" 
          element={
            user?.emailVerified ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <VerifyEmail />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <UserDashboard 
                user={user} 
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" state={{ from: '/dashboard' }} replace />
            )
          } 
        />
        <Route 
          path="/builder" 
          element={
            user ? (
              <AltarBuilder 
                user={user} 
                onLogout={handleLogout} 
                adminMode={user?.role === 'admin'}
              />
            ) : (
              <Navigate to="/" state={{ from: '/builder' }} replace />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' ? (
              <AdminDashboard 
                user={user} 
                onLogout={handleLogout} 
                onBackToBuilder={() => navigate('/builder')}
              />
            ) : (
              <Navigate to="/" state={{ from: '/admin' }} replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={handleCloseLogin}
          onNavigateToRegister={() => {
            handleCloseLogin();
            handleRegister();
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;