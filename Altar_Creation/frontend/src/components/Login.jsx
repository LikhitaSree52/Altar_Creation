import React, { useState } from 'react';

const Login = ({ onSwitchToRegister, loginType = 'user', onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Your login logic here
      // You can check loginType to determine if it's an admin login
      if (loginType === 'admin' && email !== 'likhitasreemandula@gmail.com') {
        throw new Error('Invalid admin credentials');
      }

      // Rest of your login logic...
      
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--modal-bg)',
        color: 'var(--modal-text)',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
      }}>
        {loginType === 'admin' && onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              left: 16,
              top: 16,
              background: 'none',
              border: 'none',
              color: 'var(--modal-text)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              zIndex: 2,
            }}
          >
            ← Back
          </button>
        )}
        <h2 style={{ 
          color: 'var(--modal-text)', 
          marginBottom: '24px', 
          textAlign: 'center',
          fontSize: '32px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 'bold',
          letterSpacing: '0.01em'
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
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px',
                color: 'var(--modal-text)',
                background: 'var(--modal-bg)',
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
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px',
                color: 'var(--modal-text)',
                background: 'var(--modal-bg)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'linear-gradient(90deg, #ffb88c 0%, #ea8d8d 100%)' : 'linear-gradient(90deg, #ffb88c 0%, #ea8d8d 100%)',
              color: 'white',
              padding: '14px 0',
              border: 'none',
              borderRadius: '32px',
              fontSize: '20px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(80,60,20,0.12)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '18px',
              marginBottom: '4px',
              letterSpacing: '0.04em',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {loginType === 'user' && (
            <p style={{ 
              textAlign: 'center', 
              marginTop: '16px',
              color: '#475569',
              fontSize: '14px'
            }}>
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea8d8d',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '17px',
                  marginLeft: '4px',
                  textDecoration: 'underline',
                  transition: 'color 0.18s',
                }}
              >
                Sign up
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login; 