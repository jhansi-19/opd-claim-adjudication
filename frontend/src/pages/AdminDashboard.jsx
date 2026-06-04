import React, { useState, useEffect } from 'react';
import { getStatistics, getAllClaims } from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, claimsResponse] = await Promise.all([
        getStatistics(),
        getAllClaims()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.statistics);
      }

      if (claimsResponse.success) {
        setClaims(claimsResponse.claims);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionBadgeClass = (decision) => {
    switch (decision) {
      case 'APPROVED':
        return 'badge-approved';
      case 'REJECTED':
        return 'badge-rejected';
      case 'PARTIAL':
        return 'badge-partial';
      case 'MANUAL_REVIEW':
        return 'badge-manual';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRecentClaims = () => {
    return claims.slice(0, 10);
  };

  const getDecisionDistribution = () => {
    if (!claims || claims.length === 0) return {};

    const dist = {
      APPROVED: 0,
      REJECTED: 0,
      PARTIAL: 0,
      MANUAL_REVIEW: 0
    };

    claims.forEach(claim => {
      if (claim.decision in dist) {
        dist[claim.decision]++;
      }
    });

    return dist;
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const decisionDist = getDecisionDistribution();
  const recentClaims = getRecentClaims();

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">📊 Admin Dashboard</div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Key Metrics */}
      {stats && (
        <>
          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-label">Total Claims</div>
              <div className="stat-value">{stats.totalClaims}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Approved</div>
              <div className="stat-value" style={{ color: '#27ae60' }}>
                {stats.approvedClaims}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Rejected</div>
              <div className="stat-value" style={{ color: '#e74c3c' }}>
                {stats.rejectedClaims}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Approval Rate</div>
              <div className="stat-value" style={{ color: '#3498db' }}>
                {stats.approvalRate}%
              </div>
            </div>
          </div>

          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-label">Partial</div>
              <div className="stat-value" style={{ color: '#f39c12' }}>
                {stats.partialClaims}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Manual Review</div>
              <div className="stat-value" style={{ color: '#16a085' }}>
                {stats.manualReviewClaims}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Approved</div>
              <div className="stat-value" style={{ color: '#27ae60' }}>
                ₹{stats.totalApprovedAmount?.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Per Claim</div>
              <div className="stat-value" style={{ color: '#2980b9' }}>
                ₹{stats.approvedClaims > 0 ? Math.round(stats.totalApprovedAmount / stats.approvedClaims).toLocaleString('en-IN') : 0}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Decision Distribution */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">🎯 Decision Distribution</div>
          <div style={{ lineHeight: '2.5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Approved</span>
              <span className="badge badge-approved">{decisionDist.APPROVED}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Rejected</span>
              <span className="badge badge-rejected">{decisionDist.REJECTED}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Partial</span>
              <span className="badge badge-partial">{decisionDist.PARTIAL}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Manual Review</span>
              <span className="badge badge-manual">{decisionDist.MANUAL_REVIEW}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">📈 Approval Insights</div>
          <div style={{ lineHeight: '2' }}>
            <div>
              <strong>Success Rate:</strong> {stats?.approvalRate || 0}%
            </div>
            <div>
              <strong>Pending Manual Review:</strong> {stats?.manualReviewClaims || 0} claims
            </div>
            <div>
              <strong>Partial Approvals:</strong> {stats?.partialClaims || 0} claims
            </div>
            <div>
              <strong>Total Value Approved:</strong> ₹{stats?.totalApprovedAmount?.toLocaleString('en-IN') || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="card">
        <div className="card-header">📋 Recent Claims</div>
        {recentClaims.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No Claims Yet</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Decision</th>
                  <th>Confidence</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map(claim => (
                  <tr key={claim._id}>
                    <td><strong>{claim.claimId}</strong></td>
                    <td>{claim.memberName}</td>
                    <td>₹{claim.approvedAmount?.toLocaleString('en-IN') || 0}</td>
                    <td>
                      <span className={`badge ${getDecisionBadgeClass(claim.decision)}`}>
                        {claim.decision}
                      </span>
                    </td>
                    <td>{(claim.confidenceScore * 100).toFixed(0)}%</td>
                    <td>{formatDate(claim.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Members by Claims */}
      <div className="card">
        <div className="card-header">👥 Top Members by Claims</div>
        {claims.length === 0 ? (
          <p>No claim data available</p>
        ) : (
          <div>
            {(() => {
              const memberStats = {};
              claims.forEach(claim => {
                if (!memberStats[claim.memberName]) {
                  memberStats[claim.memberName] = {
                    count: 0,
                    approved: 0,
                    totalAmount: 0
                  };
                }
                memberStats[claim.memberName].count++;
                if (claim.decision === 'APPROVED') {
                  memberStats[claim.memberName].approved++;
                  memberStats[claim.memberName].totalAmount += claim.approvedAmount || 0;
                }
              });

              const topMembers = Object.entries(memberStats)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5);

              return (
                <div style={{ lineHeight: '2.5' }}>
                  {topMembers.map(([name, data]) => (
                    <div key={name} style={{ paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{name}</strong>
                          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                            {data.count} claims • {data.approved} approved • ₹{data.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="card">
        <div className="card-header">ℹ️ System Information</div>
        <div style={{ lineHeight: '2' }}>
          <div><strong>API Endpoint:</strong> http://localhost:5000/api</div>
          <div><strong>Swagger Docs:</strong> <a href="http://localhost:5000/api-docs" target="_blank" rel="noopener noreferrer">http://localhost:5000/api-docs</a></div>
          <div><strong>Database:</strong> MongoDB Atlas</div>
          <div><strong>OCR Engine:</strong> Tesseract.js</div>
          <div><strong>AI Model:</strong> Groq Llama 3.3 (70B)</div>
          <div><strong>Last Refresh:</strong> {new Date().toLocaleTimeString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
