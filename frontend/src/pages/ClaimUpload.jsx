import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadClaim } from '../services/api';

function ClaimUpload() {
  const [formData, setFormData] = useState({
    memberName: '',
    memberId: ''
  });

  const [files, setFiles] = useState({
    prescription: null,
    bill: null,
    diagnosticReport: null,
    pharmacyBill: null
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const validateForm = () => {
    if (!formData.memberName.trim()) {
      setMessage('Member name is required');
      setMessageType('error');
      return false;
    }

    if (!formData.memberId.trim()) {
      setMessage('Member ID is required');
      setMessageType('error');
      return false;
    }

    const uploadedCount = Object.values(files).filter(f => f !== null).length;
    if (uploadedCount === 0) {
      setMessage('Please upload at least one document');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('memberName', formData.memberName);
      formDataToSend.append('memberId', formData.memberId);

      // Add files
      if (files.prescription) {
        formDataToSend.append('prescription', files.prescription);
      }
      if (files.bill) {
        formDataToSend.append('bill', files.bill);
      }
      if (files.diagnosticReport) {
        formDataToSend.append('diagnosticReport', files.diagnosticReport);
      }
      if (files.pharmacyBill) {
        formDataToSend.append('pharmacyBill', files.pharmacyBill);
      }

      const response = await uploadClaim(formDataToSend);

      if (response.success) {
        setMessage('Claim uploaded and processed successfully!');
        setMessageType('success');

        // Reset form
        setFormData({ memberName: '', memberId: '' });
        setFiles({ prescription: null, bill: null, diagnosticReport: null, pharmacyBill: null });

        // Redirect to claim details after 2 seconds
        setTimeout(() => {
          navigate(`/claim/${response.claim.claimId}`);
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to upload claim');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">📤 Upload Claim</div>

        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Member Name *</label>
            <input
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleInputChange}
              placeholder="e.g., Rajesh Kumar"
              required
            />
          </div>

          <div className="form-group">
            <label>Member ID *</label>
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              placeholder="e.g., EMP001"
              required
            />
          </div>

          <div className="form-group">
            <label>📋 Prescription (PDF, PNG, JPG)</label>
            <div className="file-upload">
              <label className="file-upload-label">
                <input
                  type="file"
                  name="prescription"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                Click to upload or drag & drop
              </label>
            </div>
            {files.prescription && (
              <div className="file-preview">
                <div className="file-item">
                  <div>
                    <div className="file-item-name">✓ {files.prescription.name}</div>
                    <div className="file-item-size">{(files.prescription.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => setFiles(prev => ({ ...prev, prescription: null }))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>💰 Medical Bill (PDF, PNG, JPG)</label>
            <div className="file-upload">
              <label className="file-upload-label">
                <input
                  type="file"
                  name="bill"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                Click to upload or drag & drop
              </label>
            </div>
            {files.bill && (
              <div className="file-preview">
                <div className="file-item">
                  <div>
                    <div className="file-item-name">✓ {files.bill.name}</div>
                    <div className="file-item-size">{(files.bill.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => setFiles(prev => ({ ...prev, bill: null }))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>🔬 Diagnostic Report (PDF, PNG, JPG)</label>
            <div className="file-upload">
              <label className="file-upload-label">
                <input
                  type="file"
                  name="diagnosticReport"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                Click to upload or drag & drop
              </label>
            </div>
            {files.diagnosticReport && (
              <div className="file-preview">
                <div className="file-item">
                  <div>
                    <div className="file-item-name">✓ {files.diagnosticReport.name}</div>
                    <div className="file-item-size">{(files.diagnosticReport.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => setFiles(prev => ({ ...prev, diagnosticReport: null }))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>💊 Pharmacy Bill (PDF, PNG, JPG)</label>
            <div className="file-upload">
              <label className="file-upload-label">
                <input
                  type="file"
                  name="pharmacyBill"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                Click to upload or drag & drop
              </label>
            </div>
            {files.pharmacyBill && (
              <div className="file-preview">
                <div className="file-item">
                  <div>
                    <div className="file-item-name">✓ {files.pharmacyBill.name}</div>
                    <div className="file-item-size">{(files.pharmacyBill.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => setFiles(prev => ({ ...prev, pharmacyBill: null }))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                '🚀 Process Claim'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">📋 Requirements</div>
        <ul>
          <li><strong>Member Details:</strong> Name and ID are mandatory</li>
          <li><strong>Minimum Documents:</strong> At least one document is required</li>
          <li><strong>Accepted Formats:</strong> PDF, PNG, JPG (max 10 MB each)</li>
          <li><strong>Prescription:</strong> Must include doctor's registration number</li>
          <li><strong>Processing Time:</strong> Usually completes within 30 seconds</li>
        </ul>
      </div>
    </div>
  );
}

export default ClaimUpload;
