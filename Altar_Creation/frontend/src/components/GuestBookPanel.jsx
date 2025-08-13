import React, { useState } from 'react';

export default function GuestBookPanel({ isOpen, onClose, messages, onAddMessage }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!name.trim() || !message.trim()) {
      setError('Name and message are required.');
      return;
    }
    setError('');
    onAddMessage({ name: name.trim(), message: message.trim(), date: new Date().toISOString() });
    setName('');
    setMessage('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.18)',
      zIndex: 1300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.18)',
        padding: 28,
        minWidth: 350,
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Guest Book</h2>
        <div style={{ marginBottom: 18 }}>
          {messages && messages.length > 0 ? messages.slice().reverse().map((m, i) => (
            <div key={i} style={{
              background: 'rgba(74,144,226,0.07)',
              borderRadius: 9,
              padding: '10px 14px',
              marginBottom: 10,
              boxShadow: '0 1px 4px #4a90e21a',
            }}>
              <div style={{ fontWeight: 600, color: '#4a90e2', fontSize: 15 }}>{m.name}</div>
              <div style={{ fontSize: 15, margin: '6px 0 2px 0', color: '#333' }}>{m.message}</div>
              <div style={{ fontSize: 12, color: '#888', textAlign: 'right' }}>{new Date(m.date).toLocaleString()}</div>
            </div>
          )) : <div style={{ color: '#888', fontSize: 15 }}>No messages yet. Be the first to leave a memory!</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e0ddd7', fontSize: 15 }}
          />
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Leave a message, memory, or prayer..."
            style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e0ddd7', fontSize: 15, minHeight: 48 }}
          />
          {error && <div style={{ color: '#d32f2f', fontSize: 13 }}>{error}</div>}
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
          >Close</button>
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 18px',
              background: 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)',
              color: 'var(--modal-text)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >Add Message</button>
        </div>
      </div>
    </div>
  );
}
