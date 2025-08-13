import React from "react";
// Use a simple chart library like Chart.js via CDN, or fallback to minimal SVG for demo

function getUserGrowthData(users) {
  // Returns [{date: 'YYYY-MM-DD', count: N}] for last 30 days
  const map = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map[key] = 0;
  }
  users.forEach(u => {
    const k = u.createdAt.slice(0, 10);
    if (map[k] !== undefined) map[k]++;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
}

function getVerificationData(users) {
  const verified = users.filter(u => u.verified).length;
  const unverified = users.length - verified;
  return [verified, unverified];
}

export default function AnalyticsCharts({ users }) {
  const growth = getUserGrowthData(users);
  const [verified, unverified] = getVerificationData(users);
  // Minimal SVG bar chart for user growth
  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', margin: '20px 0' }}>
      <div className="glass-card" style={{ padding: 16, flex: 1, minWidth: 280 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>User Signups (Last 30 Days)</div>
        <div style={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {growth.every(d => d.count === 0) ? (
            <div style={{ color: '#888', fontSize: 16, textAlign: 'center', width: '100%' }}>
              No user signups in the last 30 days
            </div>
          ) : (
            <svg width="100%" height="120" viewBox={`0 0 330 120`} style={{ width: '100%', height: 120 }}>
              {growth.map((d, i) => (
                <g key={d.date}>
                  <rect
                    x={i * 11 + 16}
                    y={110 - d.count * 10}
                    width={10}
                    height={d.count * 10}
                    rx={3}
                    fill="#6a8dff"
                    style={{ transition: 'height 0.25s, y 0.25s' }}
                  >
                    <title>{`${d.count} signups on ${d.date}`}</title>
                  </rect>
                  {d.count > 0 && (
                    <text
                      x={i * 11 + 21}
                      y={110 - d.count * 10 - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6a8dff"
                      style={{ fontWeight: 700 }}
                    >
                      {d.count}
                    </text>
                  )}
                </g>
              ))}
              {/* X axis labels */}
              {growth.map((d, i) => (
                i % 4 === 0 ? (
                  <text
                    key={d.date + '-label'}
                    x={i * 11 + 21}
                    y={118}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#888"
                  >
                    {d.date.slice(5)}
                  </text>
                ) : null
              ))}
            </svg>
          )}
        </div>
      </div>
      <div className="glass-card" style={{ padding: 16, flex: 1, minWidth: 200 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Verification Rate</div>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#eee" />
          <circle
            cx="50" cy="50" r="40"
            fill="none" stroke="#6a8dff" strokeWidth="12"
            strokeDasharray={`${(verified / (verified+unverified||1)) * 251},251`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div style={{ fontSize: 14, marginTop: 8 }}>
          {Math.round((verified/(verified+unverified||1))*100)}% Verified
        </div>
      </div>
    </div>
  );
}
