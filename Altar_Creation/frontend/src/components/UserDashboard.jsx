import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import designService from '../services/designService';

const UserDashboard = ({ user, onLogout }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDesigns = async () => {
      try {
        setLoading(true);
        const userDesigns = await designService.getUserDesigns();
        // Ensure designs is always an array
        setDesigns(Array.isArray(userDesigns) ? userDesigns : []);
      } catch (err) {
        setError('Failed to load your designs. Please try again.');
        console.error('Error fetching designs:', err);
        // Set empty array on error to prevent .map errors
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDesigns();
    }
  }, [user]);

  const handleDesignClick = (designId) => {
    navigate(`/builder?design=${designId}`);
  };

  const handleCreateNew = () => {
    navigate('/builder');
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme.colors.background,
        color: theme.colors.text,
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Please log in to view your dashboard</h2>
          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: theme.colors.background,
      color: theme.colors.text,
      minHeight: '100vh',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: `1px solid ${theme.colors.border}`,
        paddingBottom: '15px',
        gap: '20px',
      }}>
        <h1 style={{ margin: 0, flex: 1 }}>My Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleCreateNew}
            style={{
              padding: '8px 16px',
              background: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ':hover': {
                opacity: 0.9,
                transform: 'translateY(-1px)',
              },
              ':active': {
                transform: 'translateY(0)',
              }
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
            New Altar
          </button>
          <div style={{ 
            width: '1px', 
            height: '24px', 
            background: theme.colors.border,
            margin: '0 4px'
          }} />
          <button
            onClick={() => navigate('/builder')}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ':hover': {
                background: theme.colors.hoverBg || 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
            Back to Builder
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ':hover': {
                background: theme.colors.hoverBg || 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>logout</span>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${theme.colors.border}`,
            borderTop: `4px solid ${theme.colors.primary}`,
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite',
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      ) : !designs || designs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No designs found</h3>
          <p>Create your first altar to get started!</p>
          <button
            onClick={handleCreateNew}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create Your First Altar
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          padding: '20px 0',
        }}>
          {designs.map((design) => (
            <div
              key={design._id}
              onClick={() => handleDesignClick(design._id)}
              style={{
                background: theme.colors.cardBackground || '#ffffff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              <div style={{
                height: '180px',
                background: design.thumbnail ? `url(${design.thumbnail}) center/cover` : theme.colors.background,
                position: 'relative',
              }}>
                {!design.thumbnail && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: theme.colors.textMuted || '#666',
                    textAlign: 'center',
                    width: '100%',
                    padding: '0 10px',
                  }}>
                    <div style={{ fontSize: '48px' }}>🖼️</div>
                    <div>No Preview</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{
                  margin: '0 0 8px',
                  color: theme.colors.text,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {design.name || 'Untitled Design'}
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: theme.colors.textMuted || '#666',
                  fontSize: '0.9em',
                }}>
                  <span>Last updated: {new Date(design.updatedAt).toLocaleDateString()}</span>
                  <span>{design.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
