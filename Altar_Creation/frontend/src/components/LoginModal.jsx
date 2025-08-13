import React, { useState, useRef, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onNavigateToRegister }) => {
  const [view, setView] = useState('options'); // 'options' or 'login'
  const [loginType, setLoginType] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin' && email !== 'likhitasreemandula@gmail.com') {
        throw new Error('Invalid admin credentials');
      }
      // Use AuthContext login
      const result = await login(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Failed to login');
      }
      // On success, close modal (AppContent will show AltarBuilder)
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('options');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div 
        ref={modalRef}
        className="fade-in"
        style={{
          background: 'var(--modal-bg)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--modal-text)',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          margin: 'auto',
          position: 'relative',
          zIndex: 1001,
          animation: 'modalFadeIn 0.38s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <button
          className="animated-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#475569',
            padding: '4px',
            lineHeight: 1
          }}
        >
          ×
        </button>

        {view === 'options' ? (
          <>
            <h2 style={{ 
              color: 'var(--modal-text)', 
              marginBottom: '24px', 
              fontSize: '24px',
              textAlign: 'center'
            }}>
              Welcome to SoulNest
            </h2>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px'
            }}>
              <button
                onClick={() => {
                  setLoginType('user');
                  setView('login');
                }}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)',
                  color: 'var(--modal-text)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  filter: 'brightness(0.95)',
                }}
              >
                <span style={{ fontSize: '20px' }}>👤</span>
                Login as User
              </button>

              <button
                onClick={() => {
                  setLoginType('admin');
                  setView('login');
                }}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)',
                  color: 'var(--modal-text)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  filter: 'brightness(0.95)',
                }}
              >
                <span style={{ fontSize: '20px' }}>👑</span>
                Login as Admin
              </button>

              <div style={{
                margin: '8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--modal-divider, #e2e8f0)' }} />
                <span style={{ color: 'var(--modal-text)', fontSize: '14px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--modal-divider, #e2e8f0)' }} />
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateToRegister();
                }}
                style={{
                  padding: '12px 20px',
                  background: '#fff',
                  color: '#475569',
                  border: '2px solid #475569',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    background: '#f8fafc'
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>✨</span>
                Create New Account
              </button>
            </div>
          </>
        ) : (
          <>
            {(loginType === 'user' || loginType === 'admin') && (
              <button
                onClick={handleBack}
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--modal-text)',
                  padding: '4px',
                  lineHeight: 1
                }}
              >
                ←
              </button>
            )}

            <h2 style={{ 
              color: 'var(--modal-text)', 
              marginBottom: '24px', 
              textAlign: 'center',
              fontSize: '24px'
            }}>
              {loginType === 'admin' ? 'Admin Login' : 'User Login'}
            </h2>

            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    color: 'var(--modal-text)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--modal-divider, #cbd5e1)',
                    borderRadius: '6px',
                    fontSize: '16px',
                    color: 'var(--modal-text)',
                    background: 'var(--modal-bg)',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    color: 'var(--modal-text)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--modal-divider, #cbd5e1)',
                    borderRadius: '6px',
                    fontSize: '16px',
                    color: 'var(--modal-text)',
                    background: 'var(--modal-bg)',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#94a3b8' : '#475569',
                  color: 'var(--modal-text)',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    background: loading ? '#94a3b8' : '#334155'
                  }
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {loginType === 'user' && (
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '16px',
                  color: 'var(--modal-text)',
                  fontSize: '14px'
                }}>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToRegister();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--modal-text)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '14px',
                      textDecoration: 'underline'
                    }}
                  >
                    Register here
                  </button>
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 