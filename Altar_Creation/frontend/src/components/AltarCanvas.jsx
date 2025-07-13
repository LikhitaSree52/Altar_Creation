import React from 'react';

export default function AltarCanvas({ items, background, userImage, onDropItem, onMoveItem }) {
  // Placeholder: will add drag-and-drop logic next
  return (
    <div style={{
      width: 600,
      height: 400,
      background: background || '#f5f5f5',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden',
      margin: '0 auto',
    }}>
      {userImage && (
        <img src={userImage} alt="User" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 120,
          maxHeight: 120,
          borderRadius: '50%',
          boxShadow: '0 0 8px #aaa',
        }} />
      )}
      {items.map((item, idx) => (
        <img
          key={idx}
          src={item.src}
          alt={item.label || item.type}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: 48,
            height: 48,
            cursor: 'move',
          }}
        />
      ))}
    </div>
  );
} 