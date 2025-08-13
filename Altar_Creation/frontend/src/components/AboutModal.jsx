import React, { useRef, useEffect } from 'react';

const AboutModal = ({ isOpen, onClose }) => {
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

        <h2 style={{ color: 'var(--modal-text)', marginBottom: '20px', fontSize: '24px' }}>About SoulNest</h2>
        
        <div style={{ color: 'var(--modal-text)' }}>
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>Our Mission</h3>
            <p style={{ marginBottom: '16px', lineHeight: 1.6, color: 'var(--modal-text)' }}>
              SoulNest is dedicated to providing a sacred digital space where you can honor and remember your loved ones. 
              We believe in creating meaningful connections between memories and emotions, allowing you to craft 
              personalized tributes that celebrate the lives of those who have touched your heart.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>What We Offer</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
              <li style={{ marginBottom: '8px' }}>Personalized digital altar creation</li>
              <li style={{ marginBottom: '8px' }}>Intuitive design tools for meaningful tributes</li>
              <li style={{ marginBottom: '8px' }}>Secure storage of your precious memories</li>
              <li style={{ marginBottom: '8px' }}>Easy sharing with family and friends</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>Privacy & Security</h3>
            <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
              We understand the personal nature of memorial tributes. Your privacy and the security of your 
              memories are our top priority. All data is encrypted and stored securely, and you have complete 
              control over who can view your altars.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--modal-text)', fontSize: '18px', marginBottom: '12px' }}>Contact Us</h3>
            <p style={{ lineHeight: 1.6 }}>
              For support or inquiries, please reach out to us at:<br />
              Email: support@soulnest.com<br />
              Hours: Monday - Friday, 9:00 AM - 5:00 PM EST
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal; 