import React, { useRef, useEffect } from 'react';

const LoginOptionsModal = ({ isOpen, onClose, onNavigateToLogin, onNavigateToRegister }) => {
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
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
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

        <h2 style={{ 
          color: '#334155', 
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
              onClose();
              onNavigateToLogin('user');
            }}
            style={{
              padding: '12px 20px',
              background: '#475569',
              color: 'white',
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
              ':hover': {
                background: '#334155'
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>👤</span>
            Login as User
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToLogin('admin');
            }}
            style={{
              padding: '12px 20px',
              background: '#1e293b',
              color: 'white',
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
              ':hover': {
                background: '#0f172a'
              }
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
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#64748b', fontSize: '14px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateToRegister();
            }}
            style={{
              padding: '12px 20px',
              background: 'var(--modal-bg)',
              color: 'var(--modal-text)',
              border: '2px solid var(--modal-text)',
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
      </div>
    </div>
  );
};

export default LoginOptionsModal; 