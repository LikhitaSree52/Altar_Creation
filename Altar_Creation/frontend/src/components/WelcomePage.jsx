import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/images/logo.png';
import HelpModal from './HelpModal';
import AboutModal from './AboutModal';
import ThemeToggle from './ThemeToggle';

export default function WelcomePage({ onLogin, onRegister, user }) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in and came here directly
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle login click
  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="welcome-root fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        width: '100%',
        background: theme.colors.headerBg || 'rgba(255,255,255,0.20)',
        borderBottom: `1px solid ${theme.colors.border || 'rgba(200, 200, 200, 0.25)'}`,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '0 0 24px 24px',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        minHeight: '80px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={logo} alt="SoulNest Logo" style={{ height: '60px', marginRight: 16 }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ThemeToggle />
          {user ? (
            <>
              {user.role === 'admin' && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="nav-button"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#333',
                    fontWeight: '500',
                    ':hover': {
                      background: 'rgba(255,255,255,1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                  Admin Dashboard
                </button>
              )}
              <button 
                onClick={() => navigate('/builder')}
                className="nav-button primary"
                style={{
                  background: 'linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(74, 108, 247, 0.3)',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(74, 108, 247, 0.4)'
                  }
                }}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>add</span>
                Create New Altar
              </button>
            </>
          ) : (
            <>
              <button
                className="animated-btn"
                onClick={() => setShowAboutModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--modal-text)',
                  fontWeight: 600,
                  fontSize: 18,
                  cursor: 'pointer',
                  marginRight: '10px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  outline: 'none',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--button-hover-bg, rgba(0,0,0,0.08))'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
                onFocus={e => e.currentTarget.style.background = 'var(--button-hover-bg, rgba(0,0,0,0.08))'}
                onBlur={e => e.currentTarget.style.background = 'none'}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>info</span>
                About
              </button>
              <button
                className="animated-btn"
                onClick={() => setShowHelpModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--modal-text)',
                  fontWeight: 600,
                  fontSize: 18,
                  cursor: 'pointer',
                  marginRight: '10px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  outline: 'none',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--button-hover-bg, rgba(0,0,0,0.08))'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
                onFocus={e => e.currentTarget.style.background = 'var(--button-hover-bg, rgba(0,0,0,0.08))'}
                onBlur={e => e.currentTarget.style.background = 'none'}
              >
                Help
              </button>
              <button
                className="animated-btn"
                onClick={handleLoginClick}
                style={{
                  background: 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)',
                  color: 'var(--modal-text)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontWeight: 600,
                  fontSize: '18px',
                  cursor: 'pointer',
                  marginLeft: '18px',
                  boxShadow: '0 2px 8px var(--modal-shadow, rgba(31,38,135,0.08))',
                  transition: 'all 0.2s, box-shadow 0.2s',
                  outline: 'none',
                }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
                onFocus={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                onBlur={e => e.currentTarget.style.filter = 'none'}
              >
                Login / Register
              </button>
            </>
          )}
        </div>
      </header>

      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '60px 20px',
        margin: '40px auto'
      }}>
        <h1 style={{
          color: 'var(--modal-text)',
          marginBottom: '16px',
          fontSize: 'clamp(36px, 6vw, 56px)',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 'bold',
        }}>
          SoulNest
        </h1>
        <h2 style={{
          color: 'var(--modal-text)',
          marginBottom: 24,
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.05)',
          fontFamily: 'var(--font-heading)',
        }}>
          Where Memories Rest, Souls Live On.
        </h2>
        
        <p style={{ 
          color: 'var(--modal-text)',
          marginBottom: 40,
          fontSize: 'clamp(16px, 2.5vw, 18px)',
          lineHeight: 1.6,
          textShadow: '0 1px 2px rgba(0,0,0,0.05)',
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
        }}>
          Design and customize virtual altars to honor and remember your loved ones. 
          Upload photos, add meaningful items, and create a lasting tribute.
        </p>
        </div>


        {/* Features section */}
        <div className="fade-in" style={{
        position: 'absolute',
        bottom: '40px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '20px',
          width: '100%',
        maxWidth: '900px',
        padding: '0 20px',
        boxSizing: 'border-box',
        }}>
          <div style={{
          background: 'var(--modal-bg)',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center',
          flex: '1',
          width: '30%',
          border: '1px solid var(--modal-text)',
          boxShadow: '0 4px 12px rgba(31,38,135,0.08)'
        }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📸</div>
          <h3 style={{ color: 'var(--modal-text)', marginBottom: '8px' }}>Photo Upload</h3>
          <p style={{ color: 'var(--modal-text)', fontSize: '14px', margin: 0 }}>
              Upload photos of your loved ones with beautiful frame options
            </p>
          </div>

          <div style={{
          background: 'var(--modal-bg)',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center',
          flex: '1',
          width: '30%',
          border: '1px solid var(--modal-text)',
          boxShadow: '0 4px 12px rgba(31,38,135,0.08)'
        }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
          <h3 style={{ color: 'var(--modal-text)', marginBottom: '8px' }}>Custom Design</h3>
          <p style={{ color: 'var(--modal-text)', fontSize: '14px', margin: 0 }}>
              Drag, resize, and arrange items to create your perfect altar
            </p>
          </div>

          <div style={{
          background: 'var(--modal-bg)',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center',
          flex: '1',
          width: '30%',
          border: '1px solid var(--modal-text)',
          boxShadow: '0 4px 12px rgba(31,38,135,0.08)'
        }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💾</div>
          <h3 style={{ color: 'var(--modal-text)', marginBottom: '8px' }}>Save & Share</h3>
          <p style={{ color: 'var(--modal-text)', fontSize: '14px', margin: 0 }}>
              Save your designs and download them to share with family
            </p>
        </div>
      </div>

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </div>
  );
} 