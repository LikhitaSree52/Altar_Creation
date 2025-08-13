import React, { useRef, useEffect } from 'react';

// WeatherEffects: rain, snow, petals (toggleable)
export default function WeatherEffects({
  type = 'petals', // 'rain' | 'snow' | 'petals'
  count = 32,
  areaWidth = '100%',
  areaHeight = '100%',
  zIndex = 13,
  style = {},
}) {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const drops = Array.from(container.children);
    drops.forEach((el, i) => {
      const duration = 5 + Math.random() * 7;
      const delay = Math.random() * 5;
      const drift = (Math.random() - 0.5) * 80;
      el.animate([
        { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${220 + Math.random()*100}px) translateX(${drift}px) rotate(${Math.random()*180-90}deg)`, opacity: 0.7 },
        { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
      ], {
        duration: duration * 1000,
        iterations: Infinity,
        direction: 'alternate',
        delay: delay * 1000,
        easing: 'cubic-bezier(0.4,0,0.2,1)'
      });
    });
  }, [count, type]);

  // Generate weather particles
  const particles = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * -10;
    let el = null;
    if (type === 'rain') {
      el = (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: 2.2 + Math.random()*1.5,
            height: 18 + Math.random()*8,
            background: 'linear-gradient(180deg, #cbe7ff 60%, #6ec6ff 100%)',
            opacity: 0.3 + Math.random()*0.5,
            borderRadius: 2,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
          }}
        />
      );
    } else if (type === 'snow') {
      el = (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: 8 + Math.random()*6,
            height: 8 + Math.random()*6,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 80%, #e0e7ef 100%)',
            opacity: 0.5 + Math.random()*0.4,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
          }}
        />
      );
    } else if (type === 'petals') {
      el = (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: 14 + Math.random()*10,
            height: 10 + Math.random()*6,
            borderRadius: '60% 40% 60% 40%/70% 40% 60% 30%',
            background: 'linear-gradient(135deg, #ffd6e0 60%, #ffb7c5 100%)',
            opacity: 0.5 + Math.random()*0.4,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
            transform: `rotate(${Math.random()*60-30}deg)`
          }}
        />
      );
    }
    return el;
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
