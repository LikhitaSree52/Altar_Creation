import React, { useState } from 'react';

const PALETTES = [
  { id: 'classic', name: 'Classic', colors: ['#fffbe9', '#e0cda9', '#a07c3b', '#d9a441'] },
  { id: 'serene', name: 'Serene Blue', colors: ['#f5f8ff', '#b8d0f7', '#7fa4d1', '#4a90e2'] },
  { id: 'lotus', name: 'Lotus Pink', colors: ['#fff0f6', '#f7c4e1', '#e87ab4', '#b43a7c'] },
  { id: 'forest', name: 'Forest', colors: ['#f0fff4', '#b7e6c9', '#5c9c7d', '#2a6a4b'] },
  { id: 'night', name: 'Night', colors: ['#232946', '#121629', '#eebbc3', '#b8c1ec'] },
];

export default function ColorPalettePanel({ isOpen, onClose, currentPalette, onSelect }) {
  const [selected, setSelected] = useState(currentPalette || 'classic');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'var(--modal-backdrop, rgba(0,0,0,0.18))',
      zIndex: 1250,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--modal-bg)',
        borderRadius: 16,
        boxShadow: '0 8px 32px var(--modal-shadow, rgba(31,38,135,0.18))',
        padding: 28,
        minWidth: 350,
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Choose Color Palette</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
          {PALETTES.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                cursor: 'pointer',
                border: selected === p.id ? '2.5px solid #4a90e2' : '2px solid #e0ddd7',
                borderRadius: 10,
                background: selected === p.id ? 'rgba(74,144,226,0.10)' : '#fff',
                boxShadow: selected === p.id ? '0 4px 20px #4a90e229' : '0 2px 8px rgba(80,60,20,0.08)',
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.18s',
              }}
            >
              <div style={{ display: 'flex', gap: 4 }}>
                {p.colors.map((c, i) => (
                  <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: c, border: '1.5px solid #e0ddd7' }} />
                ))}
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginLeft: 10 }}>{p.name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              background: '#f8f8fa',
              color: '#555',
              border: '1.5px solid #e0ddd7',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >Cancel</button>
          <button
            onClick={() => onSelect(selected)}
            style={{
              padding: '8px 18px',
              background: 'linear-gradient(90deg, var(--primary-gradient-start) 0%, var(--primary-gradient-end) 100%)',
              color: 'var(--modal-text)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >Apply</button>
        </div>
      </div>
    </div>
  );
}
