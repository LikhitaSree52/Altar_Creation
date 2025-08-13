import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        <div>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.32)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: 'var(--modal-bg, #fff)',
    color: 'var(--modal-text, #222)',
    borderRadius: 14,
    boxShadow: '0 6px 36px 0 rgba(0,0,0,0.18)',
    padding: '26px 20px 18px 20px',
    minWidth: 320,
    maxWidth: 420,
    width: '90%',
    position: 'relative',
    animation: 'fadeIn 0.2s',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 18,
    background: 'none',
    border: 'none',
    fontSize: 24,
    color: 'var(--modal-text, #222)',
    cursor: 'pointer',
    zIndex: 2,
  },
};

export default Modal;
