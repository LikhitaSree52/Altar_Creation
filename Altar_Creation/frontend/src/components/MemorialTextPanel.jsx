import React, { useState } from 'react';

export default function MemorialTextPanel({
  isOpen,
  onClose,
  text,
  quote,
  dates,
  onSave
}) {
  const [editText, setEditText] = useState(text || '');
  const [editQuote, setEditQuote] = useState(quote || '');
  const [editDates, setEditDates] = useState(dates || '');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.20)',
      zIndex: 1200,
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
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Memorial Details</h2>
        <label style={{ fontWeight: 600, marginBottom: 4 }}>Name / Title</label>
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          placeholder="e.g. In Loving Memory of ..."
          style={{ marginBottom: 14, padding: 8, borderRadius: 6, border: '1.5px solid #e0ddd7', fontSize: 15 }}
        />
        <label style={{ fontWeight: 600, marginBottom: 4 }}>Quote / Message</label>
        <textarea
          value={editQuote}
          onChange={e => setEditQuote(e.target.value)}
          placeholder="e.g. Forever in our hearts ..."
          style={{ marginBottom: 14, padding: 8, borderRadius: 6, border: '1.5px solid #e0ddd7', fontSize: 15, minHeight: 54 }}
        />
        <label style={{ fontWeight: 600, marginBottom: 4 }}>Dates</label>
        <input
          type="text"
          value={editDates}
          onChange={e => setEditDates(e.target.value)}
          placeholder="e.g. Jan 1, 1940 – Dec 31, 2020"
          style={{ marginBottom: 18, padding: 8, borderRadius: 6, border: '1.5px solid #e0ddd7', fontSize: 15 }}
        />
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
            onClick={() => onSave({ text: editText, quote: editQuote, dates: editDates })}
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
          >Save</button>
        </div>
      </div>
    </div>
  );
}
