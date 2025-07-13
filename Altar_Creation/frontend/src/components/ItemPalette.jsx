import React, { useState } from 'react';

const ITEMS = [
  { type: 'candle', label: 'Candle', img: '/images/Candle-unscreen.gif' },
  { type: 'flower', label: 'Flower', img: '/images/Bouquet-unscreen.gif'},
  { type: 'incense', label: 'Incense', img: 'https://media2.giphy.com/media/hFvyie6CJ0eH5YJCQr/giphy.gif?cid=790b761125550ca46c64205ca4e0e29dcd409ea59ec68212&rid=giphy.gif&ct=s' },
  { type: 'fruit', label: 'Fruit', img: '/images/fruits-unscreen.png' },
  { type: 'garland', label: 'Garland', img: '/images/garland-unscreen.png' },
];

export default function ItemPalette({ onDragStart, customItems = [], onCustomStickerUpload }) {
  const [open, setOpen] = useState(false);

  // Debug: log customItems to check for invalid objects
  console.log('customItems:', customItems);

  const handleStickerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newSticker = { label: file.name, img: ev.target.result };
      if (onCustomStickerUpload) {
        onCustomStickerUpload(newSticker);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ width: '100%' }}>
      <button
        style={{
          width: '100%',
          padding: '8px 0',
          borderRadius: 8,
          border: '1px solid #e0ddd7',
          background: '#f8f6f2',
          fontWeight: 600,
          color: '#5a4a2c',
          cursor: 'pointer',
          marginBottom: 8,
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide Items' : 'Show Items'}
      </button>
      {open && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginTop: 8,
        }}>
          {ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              style={{
                width: '100%',
                height: 56,
                background: '#f8f6f2',
                borderRadius: 12,
                boxShadow: '0 1px 4px rgba(80,60,20,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                border: '1px solid #e0ddd7',
                userSelect: 'none',
                overflow: 'hidden',
              }}
              title={item.label}
            >
              <img src={item.img} alt={item.label} style={{ width: 40, height: 40, objectFit: 'contain' }} />
              <span style={{ fontSize: 12, color: '#7a6f57', marginTop: 2 }}>{item.label}</span>
            </div>
          ))}
          {/* Upload custom sticker button */}
          <label style={{
            width: '100%',
            height: 56,
            background: '#f8f6f2',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(80,60,20,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid #e0ddd7',
            userSelect: 'none',
            overflow: 'hidden',
            fontSize: 12,
            color: '#7a6f57',
            flexDirection: 'column',
          }}>
            + Sticker
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleStickerUpload} />
          </label>
          {/* Render custom uploaded stickers */}
          {customItems.length > 0 && (
            <div style={{ 
              gridColumn: '1 / -1',
              borderTop: '1px solid #e0ddd7', 
              margin: '8px 0' 
            }} />
          )}
          {customItems.map((item, idx) => {
            if (typeof item.img !== 'string') {
              console.error('Invalid custom item:', item);
              return null;
            }
            return (
            <div
              key={item.label + idx}
              draggable
              onDragStart={e => onDragStart(e, { ...item, type: 'custom' })}
              style={{
                  width: '100%',
                height: 56,
                background: '#f8f6f2',
                borderRadius: 12,
                boxShadow: '0 1px 4px rgba(80,60,20,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                border: '1px solid #e0ddd7',
                userSelect: 'none',
                overflow: 'hidden',
              }}
              title={item.label}
            >
              <img src={item.img} alt={item.label} style={{ width: 40, height: 40, objectFit: 'contain' }} />
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}