import React from 'react';

export default function WelcomePage({ onStartBuilding, user, onLogout }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e6e3 0%, #f5f3ef 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      position: 'relative',
      padding: '20px'
    }}>
      {/* User info and logout - only show if user is logged in */}
      {user && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#5a4a2c'
          }}>
            Welcome back, {user?.firstName || user?.username || 'User'}!
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      )}

      <div style={{
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          color: '#5a4a2c',
          marginBottom: 16,
          fontWeight: 600,
          letterSpacing: 1,
          fontSize: 'clamp(28px, 5vw, 48px)',
        }}>
          🕯️ Altar Builder
        </h1>
        
        <h2 style={{
          color: '#7a6f57',
          marginBottom: 24,
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 400
        }}>
          Create Beautiful Memorial Altars
        </h2>
        
        <p style={{ 
          color: '#7a6f57', 
          marginBottom: 40, 
          fontSize: 'clamp(16px, 2.5vw, 18px)',
          lineHeight: 1.6
        }}>
          Design and customize virtual altars to honor and remember your loved ones. 
          Upload photos, add meaningful items, and create a lasting tribute.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center'
        }}>
          <button
            style={{
              padding: '16px 40px',
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              borderRadius: 12,
              background: '#e0ddd7',
              color: '#5a4a2c',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(80,60,20,0.08)',
              transition: 'transform 0.2s ease',
              minWidth: '200px'
            }}
            onClick={onStartBuilding}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {user ? 'Continue Building' : 'Start Building'}
          </button>

          {!user && (
            <p style={{
              color: '#7a6f57',
              fontSize: '14px',
              margin: 0
            }}>
              Sign up or log in to save your designs
            </p>
          )}
        </div>

        {/* Features section */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '20px',
          width: '100%',
          maxWidth: '900px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            flex: '1',
            width: '30%'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📸</div>
            <h3 style={{ color: '#5a4a2c', marginBottom: '8px' }}>Photo Upload</h3>
            <p style={{ color: '#7a6f57', fontSize: '14px', margin: 0 }}>
              Upload photos of your loved ones with beautiful frame options
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            flex: '1',
            width: '30%'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
            <h3 style={{ color: '#5a4a2c', marginBottom: '8px' }}>Custom Design</h3>
            <p style={{ color: '#7a6f57', fontSize: '14px', margin: 0 }}>
              Drag, resize, and arrange items to create your perfect altar
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            flex: '1',
            width: '30%'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💾</div>
            <h3 style={{ color: '#5a4a2c', marginBottom: '8px' }}>Save & Share</h3>
            <p style={{ color: '#7a6f57', fontSize: '14px', margin: 0 }}>
              Save your designs and download them to share with family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 