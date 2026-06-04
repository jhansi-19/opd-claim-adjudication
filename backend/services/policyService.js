import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let policyData = null;

export const loadPolicy = () => {
  try {
    const policyPath = path.join(__dirname, '../../policy_terms.json');
    const policyJson = fs.readFileSync(policyPath, 'utf-8');
    policyData = JSON.parse(policyJson);
    console.log('Policy loaded successfully');
    return policyData;
  } catch (error) {
    console.error('Failed to load policy:', error.message);
    throw error;
  }
};

export const getPolicy = () => {
  if (!policyData) {
    return loadPolicy();
  }
  return policyData;
};

export const checkCoverage = (serviceCategory) => {
  const policy = getPolicy();
  const coverageDetails = policy.coverage_details;

  if (serviceCategory === 'consultation' || serviceCategory === 'consultation_fees') {
    return coverageDetails.consultation_fees.covered;
  } else if (serviceCategory === 'diagnostic_tests' || serviceCategory === 'tests') {
    return coverageDetails.diagnostic_tests.covered;
  } else if (serviceCategory === 'pharmacy' || serviceCategory === 'medicines') {
    return coverageDetails.pharmacy.covered;
  } else if (serviceCategory === 'dental') {
    return coverageDetails.dental.covered;
  } else if (serviceCategory === 'vision') {
    return coverageDetails.vision.covered;
  } else if (serviceCategory === 'alternative_medicine') {
    return coverageDetails.alternative_medicine.covered;
  }

  return false;
};

export const getSubLimit = (serviceCategory) => {
  const policy = getPolicy();
  const coverageDetails = policy.coverage_details;

  const mapping = {
    'consultation': 'consultation_fees',
    'consultation_fees': 'consultation_fees',
    'diagnostic_tests': 'diagnostic_tests',
    'tests': 'diagnostic_tests',
    'pharmacy': 'pharmacy',
    'medicines': 'pharmacy',
    'dental': 'dental',
    'vision': 'vision',
    'alternative_medicine': 'alternative_medicine'
  };

  const key = mapping[serviceCategory];
  if (key && coverageDetails[key]) {
    return coverageDetails[key].sub_limit || 0;
  }

  return 0;
};

export const getAnnualLimit = () => {
  const policy = getPolicy();
  return policy.coverage_details.annual_limit;
};

export const getPerClaimLimit = () => {
  const policy = getPolicy();
  return policy.coverage_details.per_claim_limit;
};

export const getCopayPercentage = (serviceCategory) => {
  const policy = getPolicy();
  const coverageDetails = policy.coverage_details;

  if (serviceCategory === 'consultation' || serviceCategory === 'consultation_fees') {
    return coverageDetails.consultation_fees.copay_percentage || 0;
  } else if (serviceCategory === 'pharmacy' || serviceCategory === 'medicines') {
    return coverageDetails.pharmacy.branded_drugs_copay || 0;
  }

  return 0;
};

export const checkExclusions = (condition) => {
  const policy = getPolicy();
  const exclusions = policy.exclusions;

  const lowerCondition = condition.toLowerCase();
  for (const exclusion of exclusions) {
    if (lowerCondition.includes(exclusion.toLowerCase())) {
      return true;
    }
  }

  return false;
};

export const getWaitingPeriod = (condition) => {
  const policy = getPolicy();
  const waitingPeriods = policy.waiting_periods;

  const lowerCondition = condition.toLowerCase();

  // Check specific conditions
  for (const [key, days] of Object.entries(waitingPeriods.specific_ailments)) {
    if (lowerCondition.includes(key.toLowerCase())) {
      return days;
    }
  }

  // Check for pre-existing disease (default)
  if (
    lowerCondition.includes('diabetes') ||
    lowerCondition.includes('hypertension') ||
    lowerCondition.includes('heart') ||
    lowerCondition.includes('asthma')
  ) {
    return waitingPeriods.pre_existing_diseases;
  }

  // Default initial waiting period
  return waitingPeriods.initial_waiting;
};

export const isNetworkHospital = (hospitalName) => {
  const policy = getPolicy();
  if (!hospitalName) return false;

  return policy.network_hospitals.some(hospital =>
    hospitalName.toLowerCase().includes(hospital.toLowerCase())
  );
};

export const getNetworkDiscount = () => {
  const policy = getPolicy();
  return policy.coverage_details.consultation_fees.network_discount || 0;
};

export const getMinimumClaimAmount = () => {
  const policy = getPolicy();
  return policy.claim_requirements.minimum_claim_amount;
};

export default {
  loadPolicy,
  getPolicy,
  checkCoverage,
  getSubLimit,
  getAnnualLimit,
  getPerClaimLimit,
  getCopayPercentage,
  checkExclusions,
  getWaitingPeriod,
  isNetworkHospital,
  getNetworkDiscount,
  getMinimumClaimAmount
};
