import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      text: '#1e293b',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      borderHover: '#cbd5e1',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowHover: 'rgba(0, 0, 0, 0.15)',
      gradient: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
      headerGradient: 'linear-gradient(to right, #f1f5f9, #e2e8f0)',
      cardGradient: 'linear-gradient(145deg, #ffffff, #f8fafc)',
      altarBackground: '#f5f3ef',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    effects: {
      blur: 'blur(12px)',
      glassBackground: 'rgba(255, 255, 255, 0.25)',
      glassBorder: 'rgba(255, 255, 255, 0.18)',
      cardShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      hoverTransform: 'translateY(-2px)',
      buttonShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#fbbf24',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      border: '#334155',
      borderHover: '#475569',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.4)',
      gradient: 'linear-gradient(135deg, #1e293b, #334155)',
      headerGradient: 'linear-gradient(to right, #0f172a, #1e293b)',
      cardGradient: 'linear-gradient(145deg, #1e293b, #334155)',
      altarBackground: '#2d3748',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    },
    effects: {
      blur: 'blur(12px)',
      glassBackground: 'rgba(15, 23, 42, 0.25)',
      glassBorder: 'rgba(148, 163, 184, 0.18)',
      cardShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      hoverTransform: 'translateY(-2px)',
      buttonShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('altar-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Auto-detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme class to <body> on theme change
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('altar-theme', newTheme);
  };

  const theme = themes[currentTheme];

  const value = {
    theme,
    currentTheme,
    toggleTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
