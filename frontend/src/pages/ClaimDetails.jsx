import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClaimById, deleteClaim } from '../services/api';

function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadClaim();
  }, [id]);

  const loadClaim = async () => {
    try {
      setLoading(true);
      const response = await getClaimById(id);
      if (response.success) {
        setClaim(response.claim);
      }
    } catch (err) {
      setError(err.message || 'Failed to load claim');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this claim?')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await deleteClaim(id);
      if (response.success) {
        navigate('/history');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete claim');
    } finally {
      setDeleting(false);
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading claim details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <Link to="/history" className="btn btn-secondary">
          Back to History
        </Link>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="container">
        <div className="alert alert-error">Claim not found</div>
        <Link to="/history" className="btn btn-secondary">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-header">{claim.claimId}</div>
            <div style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
              {claim.memberName} ({claim.memberId})
            </div>
          </div>
          <div>
            <span className={`badge ${getDecisionBadgeClass(claim.decision)}`}>
              {claim.decision}
            </span>
          </div>
        </div>
      </div>

      {/* Decision Section */}
      <div className="card">
        <div className="detail-section">
          <div className="detail-title">📋 Decision Summary</div>
          <div className="detail-row">
            <div className="detail-label">Decision:</div>
            <div className="detail-value">
              <span className={`badge ${getDecisionBadgeClass(claim.decision)}`}>
                {claim.decision}
              </span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Approved Amount:</div>
            <div className="detail-value">₹{claim.approvedAmount?.toLocaleString('en-IN') || 0}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Confidence Score:</div>
            <div className="detail-value">
              {(claim.confidenceScore * 100).toFixed(1)}%
              <div className="progress" style={{ marginTop: '0.5rem' }}>
                <div
                  className={`progress-bar ${claim.confidenceScore >= 0.8 ? 'success' : claim.confidenceScore >= 0.6 ? '' : 'danger'}`}
                  style={{ width: `${claim.confidenceScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Data */}
      {claim.extractedData && Object.keys(claim.extractedData).length > 0 && (
        <div className="card">
          <div className="detail-section">
            <div className="detail-title">📊 Extracted Information</div>
            {claim.extractedData.patient_name && (
              <div className="detail-row">
                <div className="detail-label">Patient:</div>
                <div className="detail-value">{claim.extractedData.patient_name}</div>
              </div>
            )}
            {claim.extractedData.doctor_name && (
              <div className="detail-row">
                <div className="detail-label">Doctor:</div>
                <div className="detail-value">{claim.extractedData.doctor_name}</div>
              </div>
            )}
            {claim.extractedData.doctor_registration && (
              <div className="detail-row">
                <div className="detail-label">Registration:</div>
                <div className="detail-value">{claim.extractedData.doctor_registration}</div>
              </div>
            )}
            {claim.extractedData.diagnosis && (
              <div className="detail-row">
                <div className="detail-label">Diagnosis:</div>
                <div className="detail-value">{claim.extractedData.diagnosis}</div>
              </div>
            )}
            {claim.extractedData.treatment_date && (
              <div className="detail-row">
                <div className="detail-label">Treatment Date:</div>
                <div className="detail-value">{formatDate(claim.extractedData.treatment_date)}</div>
              </div>
            )}
            {claim.extractedData.claim_amount && (
              <div className="detail-row">
                <div className="detail-label">Claim Amount:</div>
                <div className="detail-value">₹{claim.extractedData.claim_amount.toLocaleString('en-IN')}</div>
              </div>
            )}
            {claim.extractedData.hospital_name && (
              <div className="detail-row">
                <div className="detail-label">Hospital:</div>
                <div className="detail-value">{claim.extractedData.hospital_name}</div>
              </div>
            )}
            {claim.extractedData.medicines && claim.extractedData.medicines.length > 0 && (
              <div className="detail-row">
                <div className="detail-label">Medicines:</div>
                <div className="detail-value">
                  <ul style={{ marginLeft: '1.5rem' }}>
                    {claim.extractedData.medicines.map((med, idx) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {claim.extractedData.tests && claim.extractedData.tests.length > 0 && (
              <div className="detail-row">
                <div className="detail-label">Tests:</div>
                <div className="detail-value">
                  <ul style={{ marginLeft: '1.5rem' }}>
                    {claim.extractedData.tests.map((test, idx) => (
                      <li key={idx}>{test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reasons */}
      {claim.rejectionReasons && claim.rejectionReasons.length > 0 && (
        <div className="card">
          <div className="detail-section">
            <div className="detail-title">⚠️ Rejection Reasons</div>
            <ul className="rejection-list">
              {claim.rejectionReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Notes */}
      {claim.notes && (
        <div className="card">
          <div className="detail-section">
            <div className="detail-title">📝 Notes</div>
            <div className="detail-value">{claim.notes}</div>
          </div>
        </div>
      )}

      {/* Submitted Documents */}
      {claim.documents && Object.keys(claim.documents).length > 0 && (
        <div className="card">
          <div className="detail-section">
            <div className="detail-title">📁 Submitted Documents</div>
            <div className="grid grid-2">
              {claim.documents.prescription && claim.documents.prescription.filename && (
                <div>
                  <strong>📋 Prescription:</strong>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {claim.documents.prescription.filename}
                  </div>
                </div>
              )}
              {claim.documents.bill && claim.documents.bill.filename && (
                <div>
                  <strong>💰 Bill:</strong>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {claim.documents.bill.filename}
                  </div>
                </div>
              )}
              {claim.documents.diagnosticReport && claim.documents.diagnosticReport.filename && (
                <div>
                  <strong>🔬 Diagnostic Report:</strong>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {claim.documents.diagnosticReport.filename}
                  </div>
                </div>
              )}
              {claim.documents.pharmacyBill && claim.documents.pharmacyBill.filename && (
                <div>
                  <strong>💊 Pharmacy Bill:</strong>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {claim.documents.pharmacyBill.filename}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="card">
        <div className="detail-section">
          <div className="detail-title">🕐 Timeline</div>
          <div className="detail-row">
            <div className="detail-label">Submitted:</div>
            <div className="detail-value">{formatDate(claim.createdAt)}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Last Updated:</div>
            <div className="detail-value">{formatDate(claim.updatedAt)}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="actions">
          <Link to="/history" className="btn btn-secondary">
            Back to History
          </Link>
          <Link to="/upload" className="btn btn-primary">
            Upload New Claim
          </Link>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Claim'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimDetails;
