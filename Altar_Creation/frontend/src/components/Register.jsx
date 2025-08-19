import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const Register = ({ onSwitchToLogin }) => {
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameCheckTimeout = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [registered, setRegistered] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (name === 'username') {
      setUsernameAvailable(null);
      if (usernameCheckTimeout.current) clearTimeout(usernameCheckTimeout.current);
      if (!value || value.length < 3 || !/^[a-zA-Z0-9_]+$/.test(value)) return;
      setCheckingUsername(true);
      usernameCheckTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(value)}`);
          const data = await res.json();
          setUsernameAvailable(data.available);
        } catch {
          setUsernameAvailable(null);
        } finally {
          setCheckingUsername(false);
        }
      }, 500);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 16) {
      newErrors.username = 'Username must be 3-16 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else if (/\s/.test(formData.username)) {
      newErrors.username = 'Username cannot contain spaces';
    } else if (window.existingUsernames && window.existingUsernames.includes(formData.username)) {
      newErrors.username = 'Username already taken';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Must include at least 1 uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Must include at least 1 lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Must include at least 1 number';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Must include at least 1 special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await axios.post('/api/auth/register', formData);
      setRegistered(true);
      setSuccessMsg('Registration successful! Please check your email and click the verification link to activate your account.');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          setErrorMsg(err.response.data.errors.map(e => e.msg).join(' '));
        } else if (err.response.data.message) {
          setErrorMsg(err.response.data.message);
        } else {
          setErrorMsg('Registration failed. Please try again.');
        }
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <Modal show={true} onClose={() => setRegistered(false)}>
        <div className="register-modal-content" style={{textAlign:'center',padding:'32px 24px'}}>
          <h2 style={{marginBottom:'18px'}}>Check your email</h2>
          <div style={{fontSize:'16px',color:'var(--modal-text)'}}>{successMsg || 'Registration successful! Please check your email and click the verification link to activate your account.'}</div>
          <button className="primary-btn" style={{marginTop:'30px'}} onClick={() => setRegistered(false)}>Close</button>
        </div>
      </Modal>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us to save your altar designs</p>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name <span style={{color: 'var(--danger, #d32f2f)'}}>*</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username <span style={{color: 'var(--danger, #d32f2f)'}}>*</span></label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Choose a username"
              disabled={loading}
              required
            />
            <div style={{fontSize:'13px',color:'var(--modal-text)',marginTop:'2px',opacity:0.8}}>
              Username must be 3-16 characters, use only letters, numbers, or underscores, no spaces, and must be unique.
            </div>
            {checkingUsername && <span className="error-text" style={{color:'#888'}}>Checking username...</span>}
           {usernameAvailable === false && <span className="error-text">Username already taken</span>}
           {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span style={{color: 'var(--danger, #d32f2f)'}}>*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span style={{color: 'var(--danger, #d32f2f)'}}>*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password"
              disabled={loading}
              required
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <ul style={{fontSize:'13px',color:'var(--modal-text)',margin:'4px 0 0 0',paddingLeft:'18px',opacity:0.9}}>
              <li style={{color: /[A-Z]/.test(formData.password) ? 'green' : '#d32f2f'}}>At least 1 uppercase letter</li>
              <li style={{color: /[a-z]/.test(formData.password) ? 'green' : '#d32f2f'}}>At least 1 lowercase letter</li>
              <li style={{color: /[0-9]/.test(formData.password) ? 'green' : '#d32f2f'}}>At least 1 number</li>
              <li style={{color: /[^A-Za-z0-9]/.test(formData.password) ? 'green' : '#d32f2f'}}>At least 1 special character</li>
              <li style={{color: formData.password.length >= 8 ? 'green' : '#d32f2f'}}>Minimum 8 characters</li>
            </ul>
            {errors.password && <span className="error-text">{errors.password}</span>} 
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password <span style={{color: 'var(--danger, #d32f2f)'}}>*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Re-enter your password"
              disabled={loading}
              required
              onFocus={() => setConfirmFocus(true)}
              onBlur={() => setConfirmFocus(false)}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={
              loading ||
              checkingUsername ||
              usernameAvailable === false ||
              !formData.firstName ||
              !formData.username ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
          {registered && (
            <div className="success-message" style={{marginTop:'18px',color:'var(--success,green)',textAlign:'center'}}>
              Registration successful! Please check your email to verify your account.
            </div>
          )}
          {errorMsg && (
            <div style={{marginTop:'18px'}}>
              <div className="error-message" style={{color:'var(--danger,#d32f2f)',textAlign:'center'}}>{errorMsg}</div>
              {formData.email &&
                (/verify|verification/i.test(errorMsg)) && (
                  <button
                    type="button"
                    className="auth-button"
                    style={{marginTop:'8px',background:'#f5f5f5',color:'#333',border:'1px solid #ccc'}}
                    onClick={async () => {
                      try {
                        const res = await axios.post('/api/auth/resend-verification', { email: formData.email });
                        setSuccessMsg(res.data.message);
                        setErrorMsg('');
                      } catch (err) {
                        setSuccessMsg('');
                        setErrorMsg(
                          err.response && err.response.data && err.response.data.message
                            ? err.response.data.message
                            : 'Failed to resend verification email.'
                        );
                      }
                    }}
                  >
                    Resend Verification Email
                  </button>
                )
              }
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--primary-bg);
          padding: 20px;
          transition: background 0.3s;
        }

        .auth-card {
          background: var(--modal-bg);
          color: var(--modal-text);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 40px;
          width: 100%;
          max-width: 500px;
          transition: background 0.3s, color 0.3s;
        }

        .auth-card h2 {
          text-align: center;
          color: var(--modal-text);
          margin-bottom: 8px;
          font-size: 32px;
          font-family: var(--font-heading);
          font-weight: bold;
          letter-spacing: 0.01em;
        }

        .auth-subtitle {
          text-align: center;
          color: var(--modal-text);
          opacity: 0.7;
          margin-bottom: 30px;
          font-size: 17px;
          font-family: var(--font-body);
          font-style: italic;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 500;
          color: var(--modal-text);
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 2px solid var(--surface-hover);
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .form-group input.error {
          border-color: var(--error);
        }

        .error-text {
          color: var(--error);
          font-size: 12px;
          margin-top: 4px;
        }

        .error-message {
          background: var(--error-bg);
          color: var(--error);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          border: 1px solid var(--error);
          font-family: var(--font-body);
          font-style: italic;
        }

        .auth-button {
          width: 100%;
          padding: 14px 0;
          background: linear-gradient(90deg, #ffb88c 0%, #ea8d8d 100%);
          color: #fff;
          border: none;
          border-radius: 32px;
          font-size: 20px;
          font-family: var(--font-heading);
          font-weight: bold;
          box-shadow: 0 4px 16px rgba(80,60,20,0.12);
          cursor: pointer;
          margin-top: 18px;
          margin-bottom: 4px;
          letter-spacing: 0.04em;
          transition: background 0.2s, box-shadow 0.2s;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid var(--surface-hover);
        }

        .auth-footer p {
          color: var(--modal-text);
          margin: 0;
          font-family: var(--font-body);
          font-style: italic;
        }

        .link-button {
          background: none;
          border: none;
          color: #ea8d8d;
          font-family: var(--font-heading);
          font-weight: bold;
          cursor: pointer;
          font-size: 17px;
          text-decoration: underline;
          margin-left: 4px;
          transition: color 0.18s;
        }

        .link-button:hover {
          color: #ff9a8d;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register; 