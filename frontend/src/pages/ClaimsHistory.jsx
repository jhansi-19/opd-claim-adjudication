import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllClaims, deleteClaim } from '../services/api';

function ClaimsHistory() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const response = await getAllClaims();
      if (response.success) {
        setClaims(response.claims);
      }
    } catch (err) {
      setError(err.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (claimId) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) {
      return;
    }

    try {
      setDeleteLoading(claimId);
      const response = await deleteClaim(claimId);
      if (response.success) {
        setClaims(claims.filter(c => c.claimId !== claimId));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete claim');
    } finally {
      setDeleteLoading(null);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">📋 Claims History</div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p>Loading claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No Claims Found</div>
            <div className="empty-state-description">
              You haven't submitted any claims yet. Start by uploading a new claim.
            </div>
            <Link to="/upload" className="btn btn-primary">
              Upload First Claim
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Member Name</th>
                  <th>Member ID</th>
                  <th>Amount</th>
                  <th>Decision</th>
                  <th>Confidence</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(claim => (
                  <tr key={claim._id}>
                    <td>{claim.claimId}</td>
                    <td>{claim.memberName}</td>
                    <td>{claim.memberId}</td>
                    <td>₹{claim.approvedAmount?.toLocaleString('en-IN') || 0}</td>
                    <td>
                      <span className={`badge ${getDecisionBadgeClass(claim.decision)}`}>
                        {claim.decision}
                      </span>
                    </td>
                    <td>{(claim.confidenceScore * 100).toFixed(0)}%</td>
                    <td>{formatDate(claim.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/claim/${claim.claimId}`}
                          className="btn btn-small btn-primary"
                        >
                          View
                        </Link>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(claim.claimId)}
                          disabled={deleteLoading === claim.claimId}
                        >
                          {deleteLoading === claim._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimsHistory;
