import React, { useState } from 'react';

// Animated interactive candle component
export default function Candle({ size = 60, lit: litProp = true, onToggle, style = {}, ...props }) {
  const [lit, setLit] = useState(litProp);

  const handleToggle = () => {
    setLit(l => !l);
    if (onToggle) onToggle(!lit);
  };

  return (
    <div
      onClick={handleToggle}
      title={lit ? 'Extinguish candle' : 'Light candle'}
      style={{
        width: size,
        height: size * 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {/* Candle body */}
      <div
        style={{
          width: size * 0.33,
          height: size * 1.2,
          background: 'linear-gradient(180deg, #fffbe6 60%, #ffe0b2 100%)',
          borderRadius: size * 0.18,
          boxShadow: '0 2px 12px 0 rgba(255, 200, 80, 0.15)',
          border: '1.5px solid #f5d99d',
          position: 'absolute',
          bottom: size * 0.15,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />
      {/* Candle flame (animated) */}
      {lit && (
        <div
          style={{
            position: 'absolute',
            top: size * 0.07,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            width: size * 0.22,
            height: size * 0.38,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 8px #ffecb3)',
          }}
        >
          <svg width={size * 0.22} height={size * 0.38} viewBox={`0 0 22 38`}>
            <defs>
              <radialGradient id="flameGlow" cx="50%" cy="60%" r="60%">
                <stop offset="0%" stopColor="#fffde9" stopOpacity="1" />
                <stop offset="80%" stopColor="#ffe082" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffb300" stopOpacity="0.5" />
              </radialGradient>
              <linearGradient id="flameCore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fffbe9"/>
                <stop offset="80%" stopColor="#ffd600"/>
                <stop offset="100%" stopColor="#ff9800"/>
              </linearGradient>
            </defs>
            <ellipse
              cx="11" cy="19" rx="10" ry="18"
              fill="url(#flameGlow)"
              style={{
                opacity: 0.4,
                animation: 'candle-flame-glow 1.6s infinite alternate',
                transformOrigin: 'center',
              }}
            />
            <path
              d="M11 2 C14 10, 20 15, 11 37 C2 15, 8 10, 11 2 Z"
              fill="url(#flameCore)"
              style={{
                animation: 'candle-flame-flicker 1.1s infinite alternate',
                transformOrigin: 'center',
              }}
            />
          </svg>
        </div>
      )}
      {/* Wick */}
      <div
        style={{
          width: size * 0.04,
          height: size * 0.16,
          background: '#bfa16c',
          position: 'absolute',
          top: size * 0.22,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: size * 0.02,
          zIndex: 2,
        }}
      />
    </div>
  );
}
