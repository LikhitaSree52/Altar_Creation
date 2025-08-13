import React, { useState } from 'react';

const CURATED_BACKGROUNDS = [
  { id: 'lotus', name: 'Lotus Pond', img: '/images/backgrounds/lotus-thumb.jpg', url: '/images/backgrounds/lotus-bg.jpg' },
  { id: 'temple', name: 'Temple Hall', img: '/images/backgrounds/temple-thumb.jpg', url: '/images/backgrounds/temple-bg.jpg' },
  { id: 'clouds', name: 'Peaceful Clouds', img: '/images/backgrounds/clouds-thumb.jpg', url: '/images/backgrounds/clouds-bg.jpg' },
  { id: 'bamboo', name: 'Bamboo Grove', img: '/images/backgrounds/bamboo-thumb.jpg', url: '/images/backgrounds/bamboo-bg.jpg' },
  { id: 'plain', name: 'Plain Light', img: '', url: '' },
];

export default function BackgroundGallery({ isOpen, onClose, onSelect, onUpload }) {
  const [selected, setSelected] = useState(null);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const handleCustomUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    setUploadError('');
    const reader = new FileReader();
    reader.onload = ev => {
      setCustomUrl(ev.target.result);
      if (onUpload) onUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.22)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.93)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)',
        padding: 28,
        minWidth: 420,
        maxWidth: 680,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, marginBottom: 12 }}>Choose Altar Background</h2>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
          {CURATED_BACKGROUNDS.map(bg => (
            <div
              key={bg.id}
              onClick={() => setSelected(bg.id)}
              style={{
                cursor: 'pointer',
                border: selected === bg.id ? '2.5px solid #4a90e2' : '2px solid #e0ddd7',
                borderRadius: 10,
                background: selected === bg.id ? 'rgba(74,144,226,0.10)' : '#fff',
                boxShadow: selected === bg.id ? '0 4px 20px #4a90e229' : '0 2px 8px rgba(80,60,20,0.08)',
                padding: 12,
                width: 110,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.18s',
              }}
            >
              {bg.img ? <img src={bg.img} alt={bg.name} style={{ width: 70, height: 55, objectFit: 'cover', marginBottom: 7, borderRadius: 6, background: '#f7f7f7' }} /> : <div style={{ width: 70, height: 55, background: '#f7f7f7', borderRadius: 6, marginBottom: 7 }} />}
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{bg.name}</div>
            </div>
          ))}
        </div>
        <div style={{ margin: '14px 0', fontSize: 13, color: '#666' }}>Or upload your own background image:</div>
        <input type="file" accept="image/*" onChange={handleCustomUpload} style={{ marginBottom: 8 }} />
        {uploadError && <div style={{ color: '#d32f2f', fontSize: 13 }}>{uploadError}</div>}
        <div style={{ display: 'flex', gap: 14, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
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
            onClick={() => {
              if (selected) {
                const bg = CURATED_BACKGROUNDS.find(b => b.id === selected);
                onSelect(bg.url);
              } else if (customUrl) {
                onSelect(customUrl);
              }
            }}
            disabled={!selected && !customUrl}
            style={{
              padding: '8px 20px',
              background: selected || customUrl ? 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)' : 'var(--modal-bg)',
              color: 'var(--modal-text)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              cursor: selected || customUrl ? 'pointer' : 'not-allowed',
              transition: 'background 0.18s',
            }}
          >Choose</button>
        </div>
      </div>
    </div>
  );
}
