/**
 * Admin Delivery Partners Management Page
 * Manage delivery partners with approval, suspension, and monitoring
 */

import { useState, useEffect } from 'react';
import '../styles/deliverypartner.css';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function DeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKYC, setFilterKYC] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const rowsPerPage = 10;

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    active: 0
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  // Filter partners
  useEffect(() => {
    let filtered = partners;

    // KYC filter
    if (filterKYC !== 'all') {
      filtered = filtered.filter(p => p.kycStatus === filterKYC);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.user?.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.partnerDetails?.vehicleNumber?.toUpperCase() || "").includes(searchTerm.toUpperCase())
      );
    }

    setFilteredPartners(filtered);
    setCurrentPage(1);
  }, [partners, searchTerm, filterKYC]);

  // =========================
  // FETCH PARTNERS
  // =========================
  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📡 Fetching delivery partners...');

      const res = await axios.get(
        `${API_BASE}/admin/partners`
      );

      console.log('✅ Partners response:', res.data);

      if (!res.data.data?.partners) {
        throw new Error("Invalid response format");
      }

      const partnersData = res.data.data.partners;
      setPartners(partnersData);

      // Calculate stats
      const total = partnersData.length;
      const approved = partnersData.filter(p => p.kycStatus === 'approved').length;
      const pending = partnersData.filter(p => p.kycStatus === 'pending').length;
      const rejected = partnersData.filter(p => p.kycStatus === 'rejected').length;
      const active = partnersData.filter(p =>
        p.currentStatus === 'available' || p.currentStatus === 'on_delivery'
      ).length;

      setStats({
        total,
        approved,
        pending,
        rejected,
        active
      });

      console.log('✅ Stats calculated:', { total, approved, pending, rejected, active });

    } catch (err) {
      console.error('❌ Fetch partners error:', err);
      setError(err.message || 'Failed to load delivery partners');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE KYC STATUS
  // =========================
  const updateKYCStatus = async (partnerId, newStatus) => {
    const reason = newStatus === 'rejected'
      ? prompt('Enter rejection reason:')
      : null;

    if (newStatus === 'rejected' && !reason) {
      return;
    }

    try {
      await axios.patch(
        `${API_BASE}/admin/partners/${partnerId}/kyc`,
        {
          kycStatus: newStatus,
          rejectionReason: reason
        }
      );

      console.log('✅ KYC status updated');
      fetchPartners();
      setSuccessMessage(`Partner KYC status updated to ${newStatus}!`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('❌ Update KYC error:', err);
      setError('Failed to update KYC status');
    }
  };

  if (loading) {
    return (
      <div className="delivery-partners-page">
        <div className="loader">⏳ Loading delivery partners...</div>
      </div>
    );
  }

  const displayPartners = filteredPartners.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="delivery-partners-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>🚗 Delivery Partners</h1>
          <p>Manage and monitor all delivery partners</p>
        </div>

        <button className="refresh-btn" onClick={fetchPartners}>
          🔄 Refresh
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="alert-success">
          <p>✅ {successMessage}</p>
          <button onClick={() => setSuccessMessage("")}>×</button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="alert-error">
          <p>❌ {error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="payment-cards">
        <div className="card">
          <div className="card-icon">🚗</div>
          <div className="card-content">
            <h3>Total Partners</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Approved</h3>
            <p>{stats.approved}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">🟢</div>
          <div className="card-content">
            <h3>Active Now</h3>
            <p>{stats.active}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, phone, or vehicle..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterKYC}
          onChange={e => setFilterKYC(e.target.value)}
        >
          <option value="all">All Partners</option>
          <option value="approved">✅ Approved</option>
          <option value="pending">⏳ Pending</option>
          <option value="rejected">❌ Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <h3>📋 Delivery Partners ({filteredPartners.length})</h3>

        {displayPartners.length === 0 ? (
          <div className="empty-state">
            <p>🚫 No partners found</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Vehicle</th>
                    <th>KYC Status</th>
                    <th>Current Status</th>
                    <th>Orders</th>
                    <th>Rating</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayPartners.map(partner => {
                    const joinDate = new Date(partner.createdAt).toLocaleDateString('en-IN');
                    const rating = partner.performance?.rating?.average || 0;
                    // ✅ GET COMPLETED DELIVERIES
                    const completedOrders = partner.performance?.completedDeliveries || 0;

                    return (
                      <tr key={partner._id}>
                        <td className="bold">{partner.user?.name || "—"}</td>
                        <td>{partner.user?.phone || "—"}</td>
                        <td>{partner.user?.email || "—"}</td>
                        <td>
                          {partner.vehicle?.number || "—"}
                        </td>
                        <td>
                          <span className={`kyc-badge ${partner.kycStatus}`}>
                            {partner.kycStatus === 'approved' && '✅ Approved'}
                            {partner.kycStatus === 'pending' && '⏳ Pending'}
                            {partner.kycStatus === 'under_review' && '🔄 Under Review'}
                            {partner.kycStatus === 'rejected' && '❌ Rejected'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${partner.currentStatus}`}>
                            {partner.currentStatus === 'available' && '🟢 Available'}
                            {partner.currentStatus === 'on_delivery' && '🚙 On Delivery'}
                            {partner.currentStatus === 'busy' && '⏸️ Busy'}
                            {partner.currentStatus === 'offline' && '⚫ Offline'}
                          </span>
                        </td>
                        {/* ✅ FIXED: Show completedDeliveries */}
                        <td className="bold">{completedOrders}</td>
                        <td>⭐ {rating.toFixed(1)}</td>
                        <td>{joinDate}</td>
                        <td>
                          <div className="action-buttons">
                            {partner.kycStatus === 'pending' && (
                              <>
                                <button
                                  className="btn-approve"
                                  onClick={() => updateKYCStatus(partner._id, 'approved')}
                                  title="Approve"
                                >
                                  ✓
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() => updateKYCStatus(partner._id, 'rejected')}
                                  title="Reject"
                                >
                                  ✕
                                </button>
                              </>
                            )}
                            {partner.kycStatus === 'approved' && (
                              <button
                                className="btn-suspend"
                                onClick={() => updateKYCStatus(partner._id, 'rejected')}
                                title="Suspend"
                              >
                                ⏸️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredPartners.length)} of {filteredPartners.length}
              </div>
              <div className="pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Previous
                </button>
                <button
                  disabled={currentPage * rowsPerPage >= filteredPartners.length}
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