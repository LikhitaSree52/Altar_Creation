import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import WelcomePage from './components/WelcomePage';
import AltarBuilder from './components/AltarBuilder';
import Login from './components/Login';
import Register from './components/Register';

const AppContent = () => {
  const { user, loading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [welcomeKey, setWelcomeKey] = useState(0); // force re-render of WelcomePage after logout

  // Custom logout handler to reset state and show welcome page
  const handleLogout = () => {
    logout();
    setShowAuth(false);
    setShowBuilder(false);
    setWelcomeKey(prev => prev + 1); // force WelcomePage to re-render
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // If user is not authenticated and wants to start building, show auth
  if (!user && showAuth) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  // If user is authenticated and wants to start building
  if (user && showBuilder) {
    return (
      <AltarBuilder 
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Show welcome page (default state)
  return (
    <WelcomePage 
      key={welcomeKey}
      onStartBuilding={() => {
        if (user) {
          setShowBuilder(true);
        } else {
          setShowAuth(true);
        }
      }}
      user={user}
      onLogout={handleLogout}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;