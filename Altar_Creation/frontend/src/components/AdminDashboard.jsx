import React, { useState, useEffect } from "react";
import axios from "axios";
import "../admin-dashboard-theme.css";
import UserDetailsModal from "./UserDetailsModal";
import StatsCards from "./StatsCards";
import AnalyticsCharts from "./AnalyticsCharts";
import ActivityFeed from "./ActivityFeed";
import UserAvatar from "./UserAvatar";

const AdminDashboard = ({ user, onLogout, onBackToBuilder }) => {
  // ...existing state

  // Demote admin to user (superadmin only)
  const handleDemote = async (id) => {
    if (!window.confirm("Demote this admin to regular user?")) return;
    setActionLoading(id);
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      try {
        await axios.patch(`/api/admin/users/${id}/demote`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Admin demoted to user.");
        setUsers(users => users.map(u => u._id === id ? { ...u, role: "user" } : u));
      } catch (err) {
        console.error('Demote API error:', err, err.response);
        if (err.response && err.response.status === 404) {
          setError('Demote route not found. Please ensure backend is running and up to date.');
        } else {
          setError(err.response?.data?.message || "Failed to demote admin");
        }
      }
    } finally {
      setActionLoading(null);
    }
  };


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [actionLoading, setActionLoading] = useState(null); // userId for which action is in progress
  const [success, setSuccess] = useState("");

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // User details modal state
  const [modalUser, setModalUser] = useState(null);
  const [userNotes, setUserNotes] = useState(""); // For admin notes, per user (expand to map if needed)

  // Table sorting handler
  function handleSort(field) {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  // Bulk selection handlers
  function toggleSelect(id) {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  }
  function toggleSelectAll() {
    // Only select/deselect filtered users (not all users)
    const visibleIds = filteredUsers.map(u => u._id);
    const allSelected = visibleIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(ids => ids.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(ids => Array.from(new Set([...ids, ...visibleIds])));
    }
  }
  // Bulk actions
  async function handleBulkDelete() {
    if (!window.confirm(`Delete ${selectedIds.length} users? This cannot be undone.`)) return;
    setActionLoading('bulk');
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await Promise.all(selectedIds.map(id => axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })));
      setSuccess("Users deleted.");
      setUsers(users => users.filter(u => !selectedIds.includes(u._id)));
      setSelectedIds([]);
    } catch (err) {
      setError("Bulk delete failed");
    } finally {
      setActionLoading(null);
    }
  }
  async function handleBulkPromote() {
    if (!window.confirm(`Promote ${selectedIds.length} users to admin?`)) return;
    setActionLoading('bulk');
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await Promise.all(selectedIds.map(id => axios.patch(`/api/admin/users/${id}/promote`, {}, { headers: { Authorization: `Bearer ${token}` } })));
      setSuccess("Users promoted to admin.");
      setUsers(users => users.map(u => selectedIds.includes(u._id) ? { ...u, role: "admin" } : u));
      setSelectedIds([]);
    } catch (err) {
      setError("Bulk promote failed");
    } finally {
      setActionLoading(null);
    }
  }
  async function handleBulkDemote() {
    if (!window.confirm(`Demote ${selectedIds.length} admins to user?`)) return;
    setActionLoading('bulk');
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await Promise.all(selectedIds.map(id => axios.patch(`/api/admin/users/${id}/demote`, {}, { headers: { Authorization: `Bearer ${token}` } })));
      setSuccess("Admins demoted to user.");
      setUsers(users => users.map(u => selectedIds.includes(u._id) ? { ...u, role: "user" } : u));
      setSelectedIds([]);
    } catch (err) {
      setError("Bulk demote failed");
    } finally {
      setActionLoading(null);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      console.log('1. Starting to fetch users...');
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem("token");
        console.log('2. Token found in localStorage:', token ? 'Yes' : 'No');
        
        if (!token) {
          const errorMsg = 'No authentication token found. Please log in again.';
          console.error('3. Error:', errorMsg);
          setError(errorMsg);
          setLoading(false);
          return;
        }
        
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const apiUrl = `${backendUrl}/api/admin/users`;
        console.log('3. Making API call to:', apiUrl);
        
        console.log('4. Request headers:', {
          'Authorization': `Bearer ${token.substring(0, 15)}...`,
          'Content-Type': 'application/json'
        });
        
        const res = await axios.get(apiUrl, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        console.log('5. API Response Status:', res.status);
        console.log('6. Response headers:', res.headers);
        
        if (res.data) {
          console.log('7. Users data received. Count:', Array.isArray(res.data) ? res.data.length : 'Invalid format');
          console.log('8. First user (if any):', Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : 'No users');
          
          const users = Array.isArray(res.data) ? res.data : [];
          setUsers(users);
          setError('');
          
          if (users.length === 0) {
            console.warn('9. Warning: No users found in the database.');
          }
        } else {
          const errorMsg = 'Unexpected response format from server';
          console.error('7. Error:', errorMsg, res);
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(`Failed to fetch users: ${err.message}`);
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error status:', err.response.status);
          console.error('Error headers:', err.response.headers);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handlePromote = async (id) => {
    if (!window.confirm("Promote this user to admin?")) return;
    setActionLoading(id);
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/api/admin/users/${id}/promote`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("User promoted to admin.");
      setUsers(users => users.map(u => u._id === id ? { ...u, role: "admin" } : u));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setActionLoading(id);
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("User deleted.");
      setUsers(users => users.filter(u => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered and sorted users
  let filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.firstName && u.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesVerified = !verifiedFilter || (verifiedFilter === "verified" ? u.verified : !u.verified);
    const regDate = new Date(u.createdAt);
    const matchesFrom = !dateFrom || regDate >= new Date(dateFrom);
    const matchesTo = !dateTo || regDate <= new Date(dateTo + 'T23:59:59');
    return matchesSearch && matchesRole && matchesVerified && matchesFrom && matchesTo;
  });
  filteredUsers.sort((a, b) => {
    let aVal = a[sortBy], bVal = b[sortBy];
    if (sortBy === "createdAt") {
      aVal = new Date(aVal); bVal = new Date(bVal);
    } else if (typeof aVal === "string" && typeof bVal === "string") {
      aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Tab state for segregation - default to 'users' tab
  const [tab, setTab] = useState('users');

  // Force show users tab if somehow it's not set
  useEffect(() => {
    if (!['users', 'analytics', 'activity'].includes(tab)) {
      setTab('users');
    }
  }, [tab]);

  return (
    <div className="admin-dashboard fade-in">
      <header className="dashboard-header" style={{
        padding: '20px',
        background: 'var(--header-bg, rgba(255, 255, 255, 0.02))',
        borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: 'var(--text-color, #333)',
            fontSize: '1.8rem',
            fontWeight: '600',
            letterSpacing: '-0.5px',
            marginRight: 'auto' // Pushes everything after this to the right
          }}>
            Admin Dashboard
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'center',
            marginLeft: 'auto' // Ensures this container stays on the right
          }}>
            <button
              onClick={onBackToBuilder}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: 'var(--text-color, #333)',
                border: '1px solid var(--border-color, #ddd)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                ':hover': {
                  background: 'var(--hover-bg, rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
              Back to Builder
            </button>
            <div style={{ 
              width: '1px', 
              height: '24px', 
              background: 'var(--border-color, rgba(0, 0, 0, 0.1))',
              margin: '0 8px'
            }} />
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: 'var(--danger-color, #dc3545)',
                border: '1px solid var(--danger-color, #dc3545)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                ':hover': {
                  background: 'var(--danger-color, #dc3545)',
                  color: 'white',
                  opacity: 0.9,
                },
              }}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main glass-card">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
          <button
            className={`dashboard-tab-btn${tab === 'users' ? ' tab-active' : ''}`}
            onClick={() => setTab('users')}
          >
            Users
          </button>
          <button
            className={`dashboard-tab-btn${tab === 'analytics' ? ' tab-active' : ''}`}
            onClick={() => setTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`dashboard-tab-btn${tab === 'activity' ? ' tab-active' : ''}`}
            onClick={() => setTab('activity')}
          >
            Activity
          </button>
        </div>
        {tab === 'users' && (
          <React.Fragment>
            <div className="dashboard-toolbar" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h2>Registered Users <span className="user-count">({filteredUsers.length})</span></h2>
              <input
                type="text"
                className="dashboard-filter-input"
                placeholder="Search by name/email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="dashboard-filter-select">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select value={verifiedFilter} onChange={e => setVerifiedFilter(e.target.value)} className="dashboard-filter-select">
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
              <label style={{ fontSize: 13 }}>From: <input type="date" className="dashboard-filter-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></label>
              <label style={{ fontSize: 13 }}>To: <input type="date" className="dashboard-filter-input" value={dateTo} onChange={e => setDateTo(e.target.value)} /></label>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="user-list">
              {/* Bulk actions toolbar */}
              {selectedIds.length > 0 && (
                <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                  <button className="delete-btn" disabled={!!actionLoading} onClick={handleBulkDelete}>Bulk Delete</button>
                  <button className="promote-btn" disabled={!!actionLoading} onClick={handleBulkPromote}>Bulk Promote</button>
                  {user.email === 'likhitasreemandula@gmail.com' && (
                    <button className="delete-btn" disabled={!!actionLoading} onClick={handleBulkDemote}>Bulk Demote</button>
                  )}
                  <span style={{ fontSize: 13, color: '#888' }}>{selectedIds.length} selected</span>
                </div>
              )}
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.includes(u._id))} onChange={toggleSelectAll} /></th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('firstName')}>Name {sortBy === 'firstName' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>Email {sortBy === 'email' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>Role {sortBy === 'role' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>Joined {sortBy === 'createdAt' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={6} className="empty-row">No users found.</td></tr>
                  )}
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="fade-in-row" style={{ cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => { setModalUser(u); setUserNotes(u.notes || ""); }}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(u._id)} onChange={() => toggleSelect(u._id)} /></td>
                      <td style={{
                        fontWeight: 600,
                        fontSize: '1.07rem',
                        color: 'var(--primary-text)',
                        whiteSpace: 'nowrap',
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                          <UserAvatar user={u} />
                          <span style={{fontWeight:600, color:'var(--primary-text)', lineHeight:'1.2'}}>{u.firstName || u.username}</span>
                        </span>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td onClick={e => e.stopPropagation()}>
                        {u.role !== 'admin' && (
                          <button
                            className="promote-btn"
                            disabled={!!actionLoading}
                            onClick={() => handlePromote(u._id)}
                          >
                            {actionLoading === u._id ? 'Promoting...' : 'Promote to Admin'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button
                            className="delete-btn"
                            disabled={!!actionLoading}
                            onClick={() => handleDelete(u._id)}
                          >
                            {actionLoading === u._id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                        {/* Demote button for admins (superadmin only, not self) */}
                        {u.role === 'admin' && user.email === 'likhitasreemandula@gmail.com' && u.email !== 'likhitasreemandula@gmail.com' && (
                          <button
                            className="delete-btn"
                            disabled={!!actionLoading}
                            onClick={() => handleDemote(u._id)}
                          >
                            {actionLoading === u._id ? 'Demoting...' : 'Demote to User'}
                          </button>
                        )}
                        {u.role === 'admin' && (!((user.email === 'likhitasreemandula@gmail.com') && (u.email !== 'likhitasreemandula@gmail.com'))) && <span className="admin-mark">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
        {tab === 'analytics' && (
          <React.Fragment>
            <StatsCards
              total={users.length}
              admins={users.filter(u => u.role === 'admin').length}
              users={users.filter(u => u.role === 'user').length}
              verified={users.filter(u => u.verified).length}
              unverified={users.filter(u => !u.verified).length}
              newThisWeek={users.filter(u => {
                const d = new Date(u.createdAt);
                const now = new Date();
                const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                return d >= weekAgo;
              }).length}
              newThisMonth={users.filter(u => {
                const d = new Date(u.createdAt);
                const now = new Date();
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
              }).length}
            />
            <AnalyticsCharts users={users} />
          </React.Fragment>
        )}
        {tab === 'activity' && <ActivityFeed users={users} />}
      </main>
      <UserDetailsModal
        user={modalUser}
        open={!!modalUser}
        onClose={() => setModalUser(null)}
        onPromote={modalUser ? () => handlePromote(modalUser._id) : undefined}
        onDemote={modalUser ? () => handleDemote(modalUser._id) : undefined}
        onDelete={modalUser ? () => handleDelete(modalUser._id) : undefined}
        loading={!!actionLoading}
        canPromote={modalUser && modalUser.role !== 'admin'}
        canDemote={modalUser && modalUser.role === 'admin' && user.email === 'likhitasreemandula@gmail.com' && modalUser.email !== 'likhitasreemandula@gmail.com'}
        canDelete={modalUser && modalUser.role !== 'admin'}
        notes={userNotes}
        onSaveNotes={setUserNotes}
      />
    </div>
  );
};

export default AdminDashboard;