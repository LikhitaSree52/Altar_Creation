import React, { useRef, useEffect } from 'react';

// Configurable floating particles (sparkles) effect
export default function FloatingParticles({
  count = 24,
  areaWidth = '100%',
  areaHeight = '100%',
  zIndex = 12,
  style = {},
}) {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const particles = Array.from(container.children);
    particles.forEach((el, i) => {
      // Animate each particle with a unique floating path
      const duration = 6 + Math.random() * 6;
      const delay = Math.random() * 4;
      el.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(-${80 + Math.random()*60}px) scale(${0.7 + Math.random()*0.5})`, opacity: 0.5 + Math.random()*0.4 },
        { transform: 'translateY(0) scale(1)', opacity: 1 },
      ], {
        duration: duration * 1000,
        iterations: Infinity,
        direction: 'alternate',
        delay: delay * 1000,
        easing: 'cubic-bezier(0.4,0,0.2,1)'
      });
    });
  }, [count]);

  // Generate random sparkles
  const particles = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = 7 + Math.random() * 8;
    const color = `hsl(${45 + Math.random()*60}, 85%, ${80 + Math.random()*10}%)`;
    const blur = 1 + Math.random() * 2;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          opacity: 0.7,
          filter: `blur(${blur}px) drop-shadow(0 0 6px ${color})`,
          pointerEvents: 'none',
        }}
      />
    );
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: 0, top: 0,
        width: areaWidth,
        height: areaHeight,
        pointerEvents: 'none',
        zIndex,
        ...style,
      }}
    >
      {particles}
    </div>
  );
}
