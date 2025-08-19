import { useState, useEffect } from 'react';
import designService from '../services/designService';

export default function ShareModal({
  isOpen,
  onClose,
  currentDesign,
}) {
  const [shareLink, setShareLink] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState('');
  const [sharePeople, setSharePeople] = useState([]);
  const [shareEmail, setShareEmail] = useState('');
  const [generalAccess, setGeneralAccess] = useState('restricted'); // 'restricted' or 'anyone'

  // Load sharing settings when modal opens
  useEffect(() => {
    const fetchSharingSettings = async () => {
      if (isOpen && currentDesign && currentDesign._id) {
        setShareLoading(true);
        setShareError('');
        try {
          const result = await designService.generateOrUpdateShareLink(
            currentDesign._id,
            generalAccess === 'anyone' ? { enabled: true, role: 'viewer' } : { enabled: false, role: 'viewer' },
            sharePeople
          );
          if (result.success) {
            setShareLink(result.shareLink.replace('/api/designs/share/', '/share/'));
            setGeneralAccess(result.generalAccess.enabled ? 'anyone' : 'restricted');
            setSharePeople(result.sharePeople || []);
          } else {
            setShareError(result.error || 'Failed to load sharing settings');
          }
        } catch (err) {
          setShareError('Failed to load sharing settings');
        } finally {
          setShareLoading(false);
        }
      }
    };
    fetchSharingSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentDesign && currentDesign._id]);

  // Handler to update sharing settings in backend
  const updateSharingSettings = async (newGeneralAccess, newSharePeople) => {
    setShareLoading(true);
    setShareError('');
    try {
      const result = await designService.updateShareSettings(
        currentDesign._id,
        newGeneralAccess === 'anyone' ? { enabled: true, role: 'viewer' } : { enabled: false, role: 'viewer' },
        newSharePeople
      );
      if (result.success) {
        setGeneralAccess(result.generalAccess.enabled ? 'anyone' : 'restricted');
        setSharePeople(result.sharePeople || []);
      } else {
        setShareError(result.error || 'Failed to update sharing settings');
      }
    } catch (err) {
      setShareError('Failed to update sharing settings');
    } finally {
      setShareLoading(false);
    }
  };

  // Handler to add a person (with backend update)
  const handleAddPerson = () => {
    if (!shareEmail.trim()) return;
    if (sharePeople.some(p => p.email === shareEmail.trim())) return;
    const updatedPeople = [...sharePeople, { email: shareEmail.trim(), name: '', role: 'viewer' }];
    setSharePeople(updatedPeople);
    setShareEmail('');
    updateSharingSettings(generalAccess, updatedPeople);
  };
  // Handler to change a person's role (with backend update)
  const handleChangePersonRole = (idx, newRole) => {
    const updatedPeople = sharePeople.map((p, i) => i === idx ? { ...p, role: newRole } : p);
    setSharePeople(updatedPeople);
    updateSharingSettings(generalAccess, updatedPeople);
  };
  // Handler to remove a person (with backend update)
  const handleRemovePerson = (idx) => {
    const updatedPeople = sharePeople.filter((_, i) => i !== idx);
    setSharePeople(updatedPeople);
    updateSharingSettings(generalAccess, updatedPeople);
  };
  // Handler to change general access (with backend update)
  const handleChangeGeneralAccess = (val) => {
    setGeneralAccess(val);
    updateSharingSettings(val, sharePeople);
  };
  // Handler to generate/copy share link (refresh from backend)
  const handleShare = async () => {
    if (!currentDesign || !currentDesign._id) {
      setShareError('Please save your design before sharing.');
      return;
    }
    setShareLoading(true);
    setShareError('');
    try {
      const result = await designService.generateOrUpdateShareLink(
        currentDesign._id,
        generalAccess === 'anyone' ? { enabled: true, role: 'viewer' } : { enabled: false, role: 'viewer' },
        sharePeople
      );
      if (result.success) {
        setShareLink(result.shareLink.replace('/api/designs/share/', '/share/'));
      } else {
        setShareError(result.error || 'Failed to generate share link.');
      }
    } catch (err) {
      setShareError('Failed to generate share link.');
    } finally {
      setShareLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="fade-in" style={{
        background: 'var(--modal-bg)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px var(--modal-shadow, rgba(31,38,135,0.17))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        margin: 'auto',
        position: 'relative',
        zIndex: 1001,
        animation: 'modalFadeIn 0.38s cubic-bezier(.4,0,.2,1)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#888',
            cursor: 'pointer',
          }}
          title="Close"
        >×</button>
        <h3 style={{ margin: 0, color: '#5a4a2c', fontWeight: 600 }}>Share Altar Design</h3>
        {/* Add people */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Add people by email"
            value={shareEmail}
            onChange={e => setShareEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e0ddd7',
              fontSize: 14,
              background: '#f8f6f2',
              color: '#5a4a2c',
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleAddPerson(); }}
          />
          <button
            className="animated-btn"
            onClick={handleAddPerson}
            style={{
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 12px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >Add</button>
        </div>
        {/* People with access */}
        <div style={{ maxHeight: 120, overflowY: 'auto', marginBottom: 4 }}>
          {sharePeople.length === 0 ? (
            <div style={{ color: '#888', fontSize: 14 }}>No people added yet.</div>
          ) : sharePeople.map((person, idx) => (
            <div key={person.email} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, color: '#5a4a2c', fontWeight: 500 }}>{person.name || person.email}</div>
              <select
                value={person.role}
                onChange={e => handleChangePersonRole(idx, e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #e0ddd7',
                  fontSize: 13,
                  background: '#f8f6f2',
                }}
              >
                <option value="viewer">Viewer</option>
                <option value="commenter">Commenter</option>
                <option value="editor">Editor</option>
              </select>
              <button
                onClick={() => handleRemovePerson(idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f44336',
                  fontSize: 18,
                  cursor: 'pointer',
                  marginLeft: 2,
                }}
                title="Remove"
              >×</button>
            </div>
          ))}
        </div>
        {/* General access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span style={{ color: '#7a6f57', fontWeight: 500 }}>General access:</span>
          <select
            value={generalAccess}
            onChange={e => handleChangeGeneralAccess(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #e0ddd7',
              fontSize: 14,
              background: '#f8f6f2',
            }}
          >
            <option value="restricted">Restricted (only people added)</option>
            <option value="anyone">Anyone with the link</option>
          </select>
        </div>
        {/* Shareable link and social buttons */}
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#7a6f57', fontWeight: 500 }}>Sharable Link:</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={shareLink || 'https://altar-app.com/share/your-link'}
              readOnly
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #e0ddd7',
                fontSize: 14,
                background: '#f8f6f2',
                color: '#5a4a2c',
              }}
              onFocus={e => e.target.select()}
            />
            <button
              className="animated-btn"
              onClick={() => {
                navigator.clipboard.writeText(shareLink || 'https://altar-app.com/share/your-link');
              }}
              style={{
                background: '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >Copy</button>
          </div>
          {/* Social share buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              className="animated-btn"
              style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareLink || 'https://altar-app.com/share/your-link')}`)}
            >WhatsApp</button>
            <button
              className="animated-btn"
              style={{ background: '#E1306C', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => window.open(`https://www.instagram.com/?url=${encodeURIComponent(shareLink || 'https://altar-app.com/share/your-link')}`)}
            >Instagram</button>
            <button
              className="animated-btn"
              style={{ background: '#4267B2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink || 'https://altar-app.com/share/your-link')}`)}
            >Facebook</button>
          </div>
        </div>
        {shareError && <div style={{ color: '#f44336', fontSize: 14 }}>{shareError}</div>}
      </div>
    </div>
  );
} 