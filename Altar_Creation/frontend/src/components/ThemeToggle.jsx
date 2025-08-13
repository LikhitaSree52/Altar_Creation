import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ style = {} }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme.effects.glassBackground,
        backdropFilter: theme.effects.blur,
        border: `1px solid ${theme.effects.glassBorder}`,
        borderRadius: '50px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: theme.colors.text,
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: theme.effects.cardShadow,
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = theme.effects.hoverTransform;
        e.target.style.boxShadow = theme.effects.buttonShadow;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = theme.effects.cardShadow;
      }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Animated background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: isDark ? '50%' : '0%',
          width: '50%',
          height: '100%',
          background: theme.colors.primary,
          borderRadius: '50px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 0,
          opacity: 0.1
        }}
      />
      
      {/* Sun icon */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: isDark ? 0.5 : 1,
          transform: isDark ? 'rotate(180deg) scale(0.8)' : 'rotate(0deg) scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        ☀️
      </div>
      
      {/* Moon icon */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: isDark ? 1 : 0.5,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.8)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        🌙
      </div>
      
      <span style={{ position: 'relative', zIndex: 1 }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;
