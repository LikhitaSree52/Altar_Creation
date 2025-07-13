import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Register new user
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        if (response.status === 400) {
          if (data.message.includes('Email already registered')) {
            throw new Error('This email is already registered. Please try logging in instead.');
          } else if (data.message.includes('Username already taken')) {
            throw new Error('This username is already taken. Please choose a different one.');
          } else {
            throw new Error(data.message || 'Please check your information and try again.');
          }
        } else {
          throw new Error(data.message || 'Registration failed. Please try again.');
        }
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true, data };
    } catch (error) {
      // Handle network errors (server not running, etc.)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please make sure the backend is running.' 
        };
      }
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid email or password');
        } else if (response.status === 404) {
          throw new Error('User not found. Please check your email or sign up.');
        } else {
          throw new Error(data.message || 'Login failed. Please try again.');
        }
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true, data };
    } catch (error) {
      // Handle network errors (server not running, etc.)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please make sure the backend is running.' 
        };
      }
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 