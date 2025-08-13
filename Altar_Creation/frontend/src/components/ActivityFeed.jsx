import React from "react";

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

export default function ActivityFeed({ users, max = 10 }) {
  // Show recent registrations and role changes (from users array)
  let events = users.map(u => ({
    type: 'register',
    user: u,
    date: u.createdAt
  }));
  // If you have user activity logs, merge here
  // For now, just registrations, newest first
  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  events = events.slice(0, max);
  return (
    <div className="glass-card" style={{ margin: '24px 0', padding: 18 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Recent Activity</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {events.length === 0 && <li style={{ color: '#888' }}>No recent activity.</li>}
        {events.map((e, i) => (
          <li key={i} style={{ marginBottom: 7, fontSize: 15 }}>
            <span role="img" aria-label="user">👤</span> <b>{e.user.firstName || e.user.username}</b> registered
            <span style={{ color: '#888', fontSize: 13, marginLeft: 7 }}>{formatTime(e.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
