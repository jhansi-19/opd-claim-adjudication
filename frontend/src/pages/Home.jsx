import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatistics } from '../services/api';

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await getStatistics();
      if (response.success) {
        setStats(response.statistics);
      }
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>🏥 OPD Claim Adjudication System</h1>
        <p>AI-powered insurance claim processing for Outpatient Department services</p>
        <Link to="/upload" className="btn btn-primary">
          Upload Claim
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : stats ? (
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
      ) : null}

      <div className="features">
        <div className="feature-box">
          <div className="feature-icon">📄</div>
          <div className="feature-title">Document Processing</div>
          <div className="feature-desc">
            Upload prescriptions, bills, and diagnostic reports. Our AI extracts key information automatically.
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon">🤖</div>
          <div className="feature-title">AI Extraction</div>
          <div className="feature-desc">
            Groq Llama 3 powered extraction ensures accurate data capture from medical documents.
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon">✅</div>
          <div className="feature-title">Smart Adjudication</div>
          <div className="feature-desc">
            Intelligent rule engine validates claims against policy terms and adjudication rules.
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon">📊</div>
          <div className="feature-title">Analytics</div>
          <div className="feature-desc">
            Comprehensive dashboard with approval rates, trends, and detailed statistics.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">How It Works</div>
        <ol style={{ lineHeight: 2 }}>
          <li><strong>Upload Documents:</strong> Submit your prescription, bill, and diagnostic reports</li>
          <li><strong>OCR Processing:</strong> Documents are automatically scanned and text is extracted</li>
          <li><strong>AI Extraction:</strong> Groq extracts structured data from the documents</li>
          <li><strong>Policy Validation:</strong> Claims are checked against insurance policy terms</li>
          <li><strong>Adjudication:</strong> Our rule engine makes approval/rejection decisions</li>
          <li><strong>Decision:</strong> You receive instant approval status with detailed breakdown</li>
        </ol>
      </div>

      <div className="card">
        <div className="card-header">Quick Navigation</div>
        <div className="grid grid-2">
          <Link to="/upload" className="btn btn-primary">
            ➕ Upload New Claim
          </Link>
          <Link to="/history" className="btn btn-secondary">
            📋 View History
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            📊 Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
