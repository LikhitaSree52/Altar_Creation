import React from 'react';
import Modal from './Modal';

export default function UserDetailsModal({ user, open, onClose, onPromote, onDemote, onDelete, loading, canPromote, canDemote, canDelete, notes, onSaveNotes }) {
  if (!user) return null;
  return (
    <Modal show={open} onClose={onClose}>
      <div className="user-details-modal" style={{ minWidth: 320, maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600, marginRight: 16
          }}>
            {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : user.firstName?.[0] || user.username?.[0] || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{user.firstName || user.username}</div>
            <div style={{ color: 'var(--modal-text)', fontSize: 14 }}>{user.email}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{user.role} {user.verified ? '✓' : ''}</div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div><b>Joined:</b> {new Date(user.createdAt).toLocaleDateString()}</div>
          <div><b>Last Login:</b> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Admin Notes</b>
          <textarea style={{ width: '100%', minHeight: 60, marginTop: 4, borderRadius: 6, border: '1px solid #ccc', padding: 8 }} value={notes} onChange={e => onSaveNotes(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Recent Activity</b>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
            {/* Placeholder for activity feed */}
            <div>No activity yet.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          {canPromote && <button className="promote-btn" disabled={loading} onClick={onPromote}>Promote to Admin</button>}
          {canDemote && <button className="delete-btn" disabled={loading} onClick={onDemote}>Demote to User</button>}
          {canDelete && <button className="delete-btn" disabled={loading} onClick={onDelete}>Delete User</button>}
          <button className="promote-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}
