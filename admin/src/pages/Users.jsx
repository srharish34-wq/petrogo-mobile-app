/**
 * Admin Users Page
 * Shows MongoDB Users + Stats
 */

import "../styles/users.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Users() {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const [stats, setStats] = useState({
    totalUsers: 0,
    customers: 0,
    bunks: 0,
    partners: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // SEARCH & FILTER
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    // Search by name, email, or phone
    if (searchTerm) {
      filtered = filtered.filter(u =>
        (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterRole, users]);

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('📡 Fetching users...');

      const res = await axios.get(
        `${API_BASE}/admin/users`
      );

      console.log('✅ Users response:', res.data);

      if (!res.data.data?.users) {
        throw new Error("Invalid response format");
      }

      const usersData = res.data.data.users;
      setUsers(usersData);

      // Calculate stats
      const totalUsers = usersData.length;
      const customers = usersData.filter(u => u.role === 'customer').length;
      const bunks = usersData.filter(u => u.role === 'petrol_bunk').length;
      const partners = usersData.filter(u => u.role === 'delivery_partner').length;

      setStats({
        totalUsers,
        customers,
        bunks,
        partners
      });

      console.log('✅ Stats calculated:', { totalUsers, customers, bunks, partners });

    } catch (err) {
      console.error('❌ Fetch users error:', err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="loader">⏳ Loading users...</div>
      </div>
    );
  }

  const displayUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Get role badge
  const getRoleBadge = (role) => {
    const badges = {
      customer: { icon: "👤", label: "Customer", color: "blue" },
      petrol_bunk: { icon: "⛽", label: "Petrol Bunk", color: "orange" },
      delivery_partner: { icon: "🚗", label: "Delivery Partner", color: "green" },
      admin: { icon: "👨‍💼", label: "Admin", color: "red" }
    };
    return badges[role] || { icon: "❓", label: role, color: "gray" };
  };

  return (
    <div className="users-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>👥 Users Management</h1>
          <p>Manage all users across the platform</p>
        </div>

        <button className="refresh-btn" onClick={fetchUsers}>
          🔄 Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert-error">
          <p>❌ {error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="payment-cards">
        <div className="card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">👤</div>
          <div className="card-content">
            <h3>Customers</h3>
            <p>{stats.customers}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">⛽</div>
          <div className="card-content">
            <h3>Petrol Bunks</h3>
            <p>{stats.bunks}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">🚗</div>
          <div className="card-content">
            <h3>Delivery Partners</h3>
            <p>{stats.partners}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, email, or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="customer">👤 Customers</option>
          <option value="petrol_bunk">⛽ Petrol Bunks</option>
          <option value="delivery_partner">🚗 Delivery Partners</option>
          <option value="admin">👨‍💼 Admin</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <h3>📋 Users ({filteredUsers.length})</h3>

        {displayUsers.length === 0 ? (
          <div className="empty-state">
            <p>🚫 No users found</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {displayUsers.map(user => {
                    const roleBadge = getRoleBadge(user.role);
                    const joinDate = new Date(user.createdAt).toLocaleDateString('en-IN');
                    const isVerified = user.isVerified ?? true;

                    return (
                      <tr key={user._id}>
                        <td className="bold">{user.name || "—"}</td>
                        <td>{user.email || "—"}</td>
                        <td>{user.phone || "—"}</td>
                        <td>
                          <span className={`role-badge ${roleBadge.color}`}>
                            {roleBadge.icon} {roleBadge.label}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${isVerified ? 'verified' : 'unverified'}`}>
                            {isVerified ? '✅ Verified' : '⏳ Unverified'}
                          </span>
                        </td>
                        <td>{joinDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
              </div>
              <div className="pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Previous
                </button>
                <button
                  disabled={currentPage * rowsPerPage >= filteredUsers.length}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}