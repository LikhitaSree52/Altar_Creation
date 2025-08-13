import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const query = useQuery();
  const navigate = useNavigate();

  const didVerify = React.useRef(false);
  useEffect(() => {
    if (didVerify.current) return; // Only run once
    didVerify.current = true;
    const token = query.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }
    axios.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Your email has been verified! You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : 'Verification failed. The link may be invalid or expired.'
        );
      });
  }, [query, navigate]);

  return (
    <Modal show={true} onClose={() => navigate('/')}> {/* Close returns to WelcomePage */}
      <div className="verify-email-modal" style={{textAlign:'center',padding:'32px 24px'}}>
        <h2>Email Verification</h2>
        {status === 'verifying' && (
          <div style={{margin:'24px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px'}}>
            <div className="spinner" style={{ width: 40, height: 40, border: '3px solid #eee', borderTop: '3px solid var(--primary, #ea8d8d)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span>Verifying your email...</span>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        {status === 'success' && (
          <>
            <div style={{color:'var(--success,green)',margin:'24px 0'}}>{message}</div>
            <div style={{marginBottom: '16px', fontSize: '15px', color: '#555'}}>Redirecting you to login...</div>
            <button className="primary-btn" onClick={() => navigate('/login')}>Go to Login</button>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="error-message" style={{color:'var(--danger,#d32f2f)',margin:'24px 0'}}>{message}</div>
            <button className="primary-btn" onClick={() => navigate('/')}>Back to Home</button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default VerifyEmail;
