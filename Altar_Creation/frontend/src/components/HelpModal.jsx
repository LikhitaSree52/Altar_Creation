import React, { useRef, useEffect } from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div 
        ref={modalRef}
        className="fade-in"
        style={{
          background: 'var(--modal-bg)',
          color: 'var(--modal-text)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.17)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          margin: 'auto',
          position: 'relative',
          zIndex: 1001,
          animation: 'modalFadeIn 0.38s cubic-bezier(.4,0,.2,1)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <button
          className="animated-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--modal-text)',
            padding: '4px',
            lineHeight: 1
          }}
        >
          ×
        </button>

        <h2 style={{ color: 'var(--modal-text)', marginBottom: '20px', fontSize: '24px' }}>Help Guide</h2>
        
        <div style={{ color: 'var(--modal-text)' }}>
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>Getting Started</h3>
            <p style={{ marginBottom: '12px', lineHeight: 1.6, color: 'var(--modal-text)' }}>
              Welcome to SoulNest! Here's how to create your first altar:
            </p>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.6, color: 'var(--modal-text)' }}>
              <li style={{ marginBottom: '8px' }}>Enter a name for your altar in the input field at the top</li>
              <li style={{ marginBottom: '8px' }}>Upload photos of your loved ones using the photo upload feature</li>
              <li style={{ marginBottom: '8px' }}>Add decorative items from the item palette on the left</li>
              <li style={{ marginBottom: '8px' }}>Arrange items by dragging them to your desired position</li>
              <li style={{ marginBottom: '8px' }}>Resize items using the corner handles</li>
            </ol>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>Managing Your Altar</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
              <li style={{ marginBottom: '8px' }}><strong>Save:</strong> Click the Save button to store your altar design</li>
              <li style={{ marginBottom: '8px' }}><strong>Load:</strong> Access your previously saved designs</li>
              <li style={{ marginBottom: '8px' }}><strong>Download:</strong> Save your altar as an image file (PNG or JPG)</li>
              <li style={{ marginBottom: '8px' }}><strong>Share:</strong> Share your altar with family and friends</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>Tips & Tricks</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
              <li style={{ marginBottom: '8px' }}>Double-click an item to bring it to the front</li>
              <li style={{ marginBottom: '8px' }}>Use the Delete key to remove selected items</li>
              <li style={{ marginBottom: '8px' }}>Hold Shift while resizing to maintain aspect ratio</li>
              <li style={{ marginBottom: '8px' }}>Right-click items for additional options</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 