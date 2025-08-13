import React from "react";

export default function UserAvatar({ user, size = 36, style = {} }) {
  const initials = (user.firstName || user.username || '?')[0].toUpperCase();
  return (
    <span
      className="user-avatar"
      style={{
        width: size, height: size, borderRadius: '50%', background: 'var(--surface-bg)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: size * 0.54, color: '#6a8dff',
        border: '2px solid var(--surface-hover)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginRight: 10,
        ...style
      }}
    >
      {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : initials}
    </span>
  );
}
