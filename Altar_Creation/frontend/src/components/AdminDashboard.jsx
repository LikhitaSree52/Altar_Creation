import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard - Registered Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>First Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Last Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Role</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.username}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.email}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.firstName || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.lastName || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.role}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{new Date(user.lastLogin).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
