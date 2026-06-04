import mongoose from 'mongoose';

const ClaimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  memberName: {
    type: String,
    required: true,
    index: true
  },
  memberId: {
    type: String,
    required: true,
    index: true
  },
  documents: {
    prescription: {
      filename: String,
      path: String,
      uploadedAt: Date
    },
    bill: {
      filename: String,
      path: String,
      uploadedAt: Date
    },
    diagnosticReport: {
      filename: String,
      path: String,
      uploadedAt: Date
    },
    pharmacyBill: {
      filename: String,
      path: String,
      uploadedAt: Date
    }
  },
  ocrText: {
    prescription: String,
    bill: String,
    diagnosticReport: String,
    pharmacyBill: String
  },
  extractedData: {
    patient_name: String,
    doctor_name: String,
    doctor_registration: String,
    diagnosis: String,
    medicines: [String],
    tests: [String],
    treatment_date: Date,
    claim_amount: Number,
    hospital_name: String
  },
  decision: {
    type: String,
    enum: ['APPROVED', 'REJECTED', 'PARTIAL', 'MANUAL_REVIEW'],
    default: null
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  rejectionReasons: [String],
  notes: String,
  policyValidation: {
    policyActive: Boolean,
    waitingPeriodSatisfied: Boolean,
    memberCovered: Boolean
  },
  limitsValidation: {
    withinAnnualLimit: Boolean,
    withinPerClaimLimit: Boolean,
    withinSubLimit: Boolean,
    appliedCopay: Number
  },
  fraudIndicators: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ClaimSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Claim', ClaimSchema);
