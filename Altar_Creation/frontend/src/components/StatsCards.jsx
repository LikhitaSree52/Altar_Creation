import React from "react";

export default function StatsCards({ total, admins, users, verified, unverified, newThisWeek, newThisMonth }) {
  return (
    <div className="stats-cards" style={{ display: 'flex', gap: 20, margin: '20px 0', flexWrap: 'wrap' }}>
      <div className="stats-card glass-card"><div className="stats-title">Total Users</div><div className="stats-value">{total}</div></div>
      <div className="stats-card glass-card"><div className="stats-title">Admins</div><div className="stats-value">{admins}</div></div>
      <div className="stats-card glass-card"><div className="stats-title">Regular Users</div><div className="stats-value">{users}</div></div>
      <div className="stats-card glass-card"><div className="stats-title">Verified</div><div className="stats-value">{verified}</div></div>
      <div className="stats-card glass-card"><div className="stats-title">Unverified</div><div className="stats-value">{unverified}</div></div>
      <div className="stats-card glass-card"><div className="stats-title">New This Week</div><div className="stats-value">{newThisWeek}</div></div>
      <div className="stats-card glass-card"><div className="stats-title">New This Month</div><div className="stats-value">{newThisMonth}</div></div>
    </div>
  );
}
