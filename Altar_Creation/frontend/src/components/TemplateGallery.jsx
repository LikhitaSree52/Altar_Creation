import React, { useState } from 'react';

// Example templates (in real app, fetch from backend or static assets)
const TEMPLATES = [
  {
    id: 'classic-hindu',
    name: 'Classic Hindu',
    img: '/images/templates/hindu.png',
    description: 'A traditional Hindu altar with diyas, garlands, and framed photo.'
  },
  {
    id: 'minimal-western',
    name: 'Minimal Western',
    img: '/images/templates/western.png',
    description: 'A minimal, modern altar with candles and a single flower.'
  },
  {
    id: 'japanese-butsudan',
    name: 'Japanese Butsudan',
    img: '/images/templates/japanese.png',
    description: 'A serene Japanese altar with incense, lanterns, and calligraphy.'
  },
  {
    id: 'blank',
    name: 'Start from Blank',
    img: '/images/templates/blank.png',
    description: 'Begin with an empty altar and customize every detail.'
  }
];

export default function TemplateGallery({ isOpen, onClose, onSelect }) {
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="fade-in" style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)',
        padding: 32,
        minWidth: 480,
        maxWidth: 720,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, marginBottom: 18 }}>Choose a Template</h2>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          {TEMPLATES.map(tmpl => (
            <div
              key={tmpl.id}
              onClick={() => setSelected(tmpl.id)}
              style={{
                cursor: 'pointer',
                border: selected === tmpl.id ? '2.5px solid #4a90e2' : '2px solid #e0ddd7',
                borderRadius: 12,
                background: selected === tmpl.id ? 'rgba(74,144,226,0.10)' : '#fff',
                boxShadow: selected === tmpl.id ? '0 4px 20px #4a90e229' : '0 2px 8px rgba(80,60,20,0.08)',
                padding: 16,
                width: 160,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.18s',
              }}
            >
              <img src={tmpl.img} alt={tmpl.name} style={{ width: 100, height: 80, objectFit: 'contain', marginBottom: 10, borderRadius: 8, background: '#f7f7f7' }} />
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{tmpl.name}</div>
              <div style={{ fontSize: 13, color: '#555', textAlign: 'center', minHeight: 36 }}>{tmpl.description}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              background: '#f8f8fa',
              color: '#555',
              border: '1.5px solid #e0ddd7',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >Cancel</button>
          <button
            onClick={() => selected && onSelect(TEMPLATES.find(t => t.id === selected))}
            disabled={!selected}
            style={{
              padding: '10px 22px',
              background: selected ? 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)' : 'var(--modal-bg)',
              color: 'var(--modal-text)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'background 0.18s',
            }}
          >Choose</button>
        </div>
      </div>
    </div>
  );
}
