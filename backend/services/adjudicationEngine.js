import * as policyService from './policyService.js';

export const adjudicateClaim = (claimData, memberProfile) => {
  const decision = {
    decision: null,
    approved_amount: 0,
    rejection_reasons: [],
    confidence_score: 1.0,
    notes: '',
    fraud_flags: []
  };

  // Step 1: Basic Eligibility Check
  const eligibilityCheck = performEligibilityCheck(claimData, memberProfile);
  if (!eligibilityCheck.passed) {
    decision.rejection_reasons.push(...eligibilityCheck.reasons);
    decision.decision = 'REJECTED';
    decision.confidence_score = 0.98;
    return decision;
  }

  // Step 2: Document Validation
  const docValidation = performDocumentValidation(claimData);
  if (!docValidation.passed) {
    decision.rejection_reasons.push(...docValidation.reasons);
    decision.decision = 'REJECTED';
    decision.confidence_score = 0.96;
    return decision;
  }

  // Step 3: Coverage Verification
  const coverageCheck = performCoverageVerification(claimData);
  if (!coverageCheck.passed) {
    decision.rejection_reasons.push(...coverageCheck.reasons);
    decision.decision = 'REJECTED';
    decision.confidence_score = 0.97;
    return decision;
  }

  // Step 4: Limit Validation
  const limitCheck = performLimitValidation(claimData, memberProfile);
  if (limitCheck.decision === 'REJECTED') {
    decision.rejection_reasons.push(...limitCheck.reasons);
    decision.decision = 'REJECTED';
    decision.confidence_score = 0.99;
    return decision;
  }

  if (limitCheck.decision === 'PARTIAL') {
    decision.decision = 'PARTIAL';
    decision.approved_amount = limitCheck.approved_amount;
    decision.notes = limitCheck.notes;
    decision.confidence_score = 0.94;
    return decision;
  }

  // Step 5: Medical Necessity Review
  const medicalCheck = performMedicalNecessityReview(claimData);
  if (!medicalCheck.passed) {
    decision.rejection_reasons.push(...medicalCheck.reasons);
    decision.decision = 'REJECTED';
    decision.confidence_score = medicalCheck.confidence;
    return decision;
  }

  // Step 6: Fraud Detection
  const fraudCheck = detectFraudIndicators(claimData, memberProfile);
  if (fraudCheck.flags.length > 0) {
    decision.fraud_flags = fraudCheck.flags;
    if (fraudCheck.highRisk) {
      decision.decision = 'MANUAL_REVIEW';
      decision.confidence_score = fraudCheck.confidence;
      decision.notes = 'Potential fraud indicators detected';
      return decision;
    }
  }

  // Check if manual review needed
  if (shouldReferForManualReview(claimData, decision)) {
    decision.decision = 'MANUAL_REVIEW';
    decision.confidence_score = Math.min(decision.confidence_score, 0.65);
    return decision;
  }

  // Final Approval
  decision.decision = 'APPROVED';
  decision.approved_amount = calculateApprovedAmount(claimData, memberProfile);
  decision.confidence_score = 0.95;
  decision.notes = 'Claim approved successfully';

  return decision;
};

const performEligibilityCheck = (claimData, memberProfile) => {
  const result = {
    passed: true,
    reasons: []
  };

  // Check policy status
  if (!memberProfile || !memberProfile.policyActive) {
    result.passed = false;
    result.reasons.push('POLICY_INACTIVE');
  }

  // Check waiting period
  if (memberProfile && claimData.extractedData?.diagnosis) {
    const waitingDays = policyService.getWaitingPeriod(claimData.extractedData.diagnosis);
    const memberJoinDate = memberProfile.joinDate;
    const treatmentDate = new Date(claimData.extractedData.treatment_date);

    if (memberJoinDate) {
      const daysElapsed = Math.floor((treatmentDate - new Date(memberJoinDate)) / (1000 * 60 * 60 * 24));
      if (daysElapsed < waitingDays) {
        result.passed = false;
        result.reasons.push('WAITING_PERIOD');
      }
    }
  }

  // Check member coverage
  if (!memberProfile || !memberProfile.covered) {
    result.passed = false;
    result.reasons.push('MEMBER_NOT_COVERED');
  }

  return result;
};

const performDocumentValidation = (claimData) => {
  const result = {
    passed: true,
    reasons: []
  };

  // Check required documents
  const documents = claimData.documents;
  if (!documents?.prescription?.path) {
    result.passed = false;
    result.reasons.push('MISSING_DOCUMENTS');
  }

  if (!documents?.bill?.path) {
    result.passed = false;
    result.reasons.push('MISSING_DOCUMENTS');
  }

  // Check prescription validity
  const prescription = claimData.extractedData;
  if (!prescription?.doctor_registration) {
    result.passed = false;
    result.reasons.push('INVALID_PRESCRIPTION');
  }

  if (!prescription?.doctor_name) {
    result.passed = false;
    result.reasons.push('DOCTOR_REG_INVALID');
  }

  // Validate doctor registration format
  if (prescription?.doctor_registration) {
    const docRegPattern = /^[A-Z]{2}\/\d+\/\d{4}$/;
    if (!docRegPattern.test(prescription.doctor_registration)) {
      result.passed = false;
      result.reasons.push('DOCTOR_REG_INVALID');
    }
  }

  return result;
};

const performCoverageVerification = (claimData) => {
  const result = {
    passed: true,
    reasons: []
  };

  const diagnosis = claimData.extractedData?.diagnosis || '';

  // Check exclusions
  if (policyService.checkExclusions(diagnosis)) {
    result.passed = false;
    result.reasons.push('EXCLUDED_CONDITION');
  }

  // Specific exclusions
  const lowerDiagnosis = diagnosis.toLowerCase();
  if (lowerDiagnosis.includes('weight loss') || lowerDiagnosis.includes('obesity') && lowerDiagnosis.includes('bariatric')) {
    result.passed = false;
    result.reasons.push('SERVICE_NOT_COVERED');
  }

  if (lowerDiagnosis.includes('cosmetic') || lowerDiagnosis.includes('whitening')) {
    result.passed = false;
    result.reasons.push('SERVICE_NOT_COVERED');
  }

  return result;
};

const performLimitValidation = (claimData, memberProfile) => {
  const result = {
    decision: 'APPROVED',
    approved_amount: claimData.extractedData?.claim_amount || 0,
    reasons: [],
    notes: ''
  };

  const claimAmount = claimData.extractedData?.claim_amount || 0;
  const perClaimLimit = policyService.getPerClaimLimit();
  const annualLimit = policyService.getAnnualLimit();
  const minAmount = policyService.getMinimumClaimAmount();

  // Check minimum amount
  if (claimAmount < minAmount) {
    result.decision = 'REJECTED';
    result.reasons.push('BELOW_MIN_AMOUNT');
    return result;
  }

  // Check per-claim limit
  if (claimAmount > perClaimLimit) {
    result.decision = 'REJECTED';
    result.reasons.push('PER_CLAIM_EXCEEDED');
    return result;
  }

  // Calculate approved amount with copay
  let approvedAmount = claimAmount;
  const copayPercent = policyService.getCopayPercentage('consultation');
  if (copayPercent > 0) {
    const copayAmount = (claimAmount * copayPercent) / 100;
    approvedAmount = claimAmount - copayAmount;
  }

  // Check annual limit
  if (memberProfile?.yearlyClaimsTotal) {
    const totalAfterClaim = memberProfile.yearlyClaimsTotal + approvedAmount;
    if (totalAfterClaim > annualLimit) {
      const remainingLimit = annualLimit - memberProfile.yearlyClaimsTotal;
      if (remainingLimit > 0) {
        result.decision = 'PARTIAL';
        result.approved_amount = remainingLimit;
        result.notes = `Annual limit exceeded. Approved amount reduced to ${remainingLimit}`;
      } else {
        result.decision = 'REJECTED';
        result.reasons.push('ANNUAL_LIMIT_EXCEEDED');
      }
      return result;
    }
  }

  result.approved_amount = approvedAmount;
  return result;
};

const performMedicalNecessityReview = (claimData) => {
  const result = {
    passed: true,
    reasons: [],
    confidence: 0.95
  };

  const extracted = claimData.extractedData;
  if (!extracted) {
    result.passed = false;
    result.reasons.push('NOT_MEDICALLY_NECESSARY');
    result.confidence = 0.70;
    return result;
  }

  // Check if diagnosis exists and medicines are prescribed
  if (!extracted.diagnosis || ((!extracted.medicines || extracted.medicines.length === 0) && (!extracted.tests || extracted.tests.length === 0))) {
    result.passed = false;
    result.reasons.push('NOT_MEDICALLY_NECESSARY');
    result.confidence = 0.72;
    return result;
  }

  return result;
};

const detectFraudIndicators = (claimData, memberProfile) => {
  const result = {
    flags: [],
    highRisk: false,
    confidence: 0.90
  };

  // Check for unusual amounts
  const amount = claimData.extractedData?.claim_amount || 0;
  if (amount > 25000) {
    result.flags.push('High value claim');
  }

  // Check for suspicious patterns
  if (memberProfile?.recentClaimsCount >= 3) {
    result.flags.push('Multiple recent claims');
    if (memberProfile.recentClaimsCount >= 5) {
      result.highRisk = true;
      result.confidence = 0.65;
    }
  }

  return result;
};

const shouldReferForManualReview = (claimData, decision) => {
  const amount = claimData.extractedData?.claim_amount || 0;

  // High value claims
  if (amount > 25000) {
    return true;
  }

  // Low confidence
  if (decision.confidence_score < 0.70) {
    return true;
  }

  return false;
};

const calculateApprovedAmount = (claimData, memberProfile) => {
  let amount = claimData.extractedData?.claim_amount || 0;
  const copayPercent = policyService.getCopayPercentage('consultation');

  if (copayPercent > 0) {
    const copayAmount = (amount * copayPercent) / 100;
    amount -= copayAmount;
  }

  // Check network hospital discount
  if (policyService.isNetworkHospital(claimData.extractedData?.hospital_name)) {
    const discountPercent = policyService.getNetworkDiscount();
    if (discountPercent > 0) {
      const discountAmount = (amount * discountPercent) / 100;
      amount -= discountAmount;
    }
  }

  return Math.round(amount * 100) / 100;
};

export default {
  adjudicateClaim,
  performEligibilityCheck,
  performDocumentValidation,
  performCoverageVerification,
  performLimitValidation,
  performMedicalNecessityReview,
  detectFraudIndicators,
  calculateApprovedAmount
};
