import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import Claim from './models/Claim.js';
import { generateClaimId } from './utils/helpers.js';

dotenv.config();

const seedData = [
  {
    claimId: generateClaimId(),
    memberName: 'Rajesh Kumar',
    memberId: 'EMP001',
    extractedData: {
      patient_name: 'Rajesh Kumar',
      doctor_name: 'Dr. Sharma',
      doctor_registration: 'KA/45678/2015',
      diagnosis: 'Viral fever',
      medicines: ['Paracetamol 650mg', 'Vitamin C'],
      tests: ['CBC', 'Dengue test'],
      treatment_date: new Date('2024-11-01'),
      claim_amount: 1500,
      hospital_name: 'Apollo Hospitals'
    },
    decision: 'APPROVED',
    approvedAmount: 1350,
    confidenceScore: 0.95,
    rejectionReasons: [],
    notes: 'Claim approved successfully'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Priya Singh',
    memberId: 'EMP002',
    extractedData: {
      patient_name: 'Priya Singh',
      doctor_name: 'Dr. Patel',
      doctor_registration: 'MH/23456/2018',
      diagnosis: 'Tooth decay requiring root canal',
      medicines: [],
      tests: [],
      treatment_date: new Date('2024-10-15'),
      claim_amount: 12000,
      hospital_name: 'Dental Clinic'
    },
    decision: 'PARTIAL',
    approvedAmount: 8000,
    confidenceScore: 0.92,
    rejectionReasons: ['Teeth whitening - cosmetic procedure'],
    notes: 'Partial approval: cosmetic procedure excluded'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Amit Verma',
    memberId: 'EMP003',
    extractedData: {
      patient_name: 'Amit Verma',
      doctor_name: 'Dr. Gupta',
      doctor_registration: 'DL/34567/2016',
      diagnosis: 'Gastroenteritis',
      medicines: ['Antibiotics', 'Probiotics'],
      tests: [],
      treatment_date: new Date('2024-10-20'),
      claim_amount: 7500,
      hospital_name: 'Max Healthcare'
    },
    decision: 'REJECTED',
    approvedAmount: 0,
    confidenceScore: 0.98,
    rejectionReasons: ['PER_CLAIM_EXCEEDED'],
    notes: 'Claim amount exceeds per-claim limit of ₹5000'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Sneha Reddy',
    memberId: 'EMP004',
    extractedData: {
      patient_name: 'Sneha Reddy',
      doctor_name: null,
      doctor_registration: null,
      diagnosis: null,
      medicines: [],
      tests: [],
      treatment_date: null,
      claim_amount: 2000,
      hospital_name: null
    },
    decision: 'REJECTED',
    approvedAmount: 0,
    confidenceScore: 1.0,
    rejectionReasons: ['MISSING_DOCUMENTS'],
    notes: 'Prescription from registered doctor is required'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Vikram Joshi',
    memberId: 'EMP005',
    extractedData: {
      patient_name: 'Vikram Joshi',
      doctor_name: 'Dr. Mehta',
      doctor_registration: 'GJ/56789/2014',
      diagnosis: 'Type 2 Diabetes',
      medicines: ['Metformin', 'Glimepiride'],
      tests: [],
      treatment_date: new Date('2024-10-15'),
      claim_amount: 3000,
      hospital_name: 'Manipal Hospitals'
    },
    decision: 'REJECTED',
    approvedAmount: 0,
    confidenceScore: 0.96,
    rejectionReasons: ['WAITING_PERIOD'],
    notes: 'Diabetes has 90-day waiting period. Eligible from 2024-11-30'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Kavita Nair',
    memberId: 'EMP006',
    extractedData: {
      patient_name: 'Kavita Nair',
      doctor_name: 'Vaidya Krishnan',
      doctor_registration: 'AYUR/KL/2345/2019',
      diagnosis: 'Chronic joint pain',
      medicines: [],
      tests: [],
      treatment_date: new Date('2024-10-28'),
      claim_amount: 4000,
      hospital_name: 'Ayurveda Clinic'
    },
    decision: 'APPROVED',
    approvedAmount: 4000,
    confidenceScore: 0.89,
    rejectionReasons: [],
    notes: 'Alternative medicine covered under policy'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Suresh Patil',
    memberId: 'EMP007',
    extractedData: {
      patient_name: 'Suresh Patil',
      doctor_name: 'Dr. Rao',
      doctor_registration: 'AP/67890/2017',
      diagnosis: 'Suspected lumbar disc herniation',
      medicines: [],
      tests: ['MRI Lumbar Spine'],
      treatment_date: new Date('2024-11-02'),
      claim_amount: 15000,
      hospital_name: 'Narayana Health'
    },
    decision: 'REJECTED',
    approvedAmount: 0,
    confidenceScore: 0.94,
    rejectionReasons: ['PRE_AUTH_MISSING'],
    notes: 'MRI requires pre-authorization for claims above ₹10000'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Ravi Menon',
    memberId: 'EMP008',
    extractedData: {
      patient_name: 'Ravi Menon',
      doctor_name: 'Dr. Khan',
      doctor_registration: 'UP/45678/2016',
      diagnosis: 'Migraine',
      medicines: ['Sumatriptan', 'Propranolol'],
      tests: [],
      treatment_date: new Date('2024-10-30'),
      claim_amount: 4800,
      hospital_name: 'Fortis Healthcare'
    },
    decision: 'MANUAL_REVIEW',
    approvedAmount: 0,
    confidenceScore: 0.65,
    rejectionReasons: [],
    notes: 'Potential fraud indicators detected - Multiple claims same day'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Anita Desai',
    memberId: 'EMP009',
    extractedData: {
      patient_name: 'Anita Desai',
      doctor_name: 'Dr. Banerjee',
      doctor_registration: 'WB/34567/2015',
      diagnosis: 'Obesity - BMI 35',
      medicines: [],
      tests: [],
      treatment_date: new Date('2024-10-18'),
      claim_amount: 8000,
      hospital_name: 'Clinic'
    },
    decision: 'REJECTED',
    approvedAmount: 0,
    confidenceScore: 0.97,
    rejectionReasons: ['SERVICE_NOT_COVERED'],
    notes: 'Weight loss treatments are excluded from coverage'
  },
  {
    claimId: generateClaimId(),
    memberName: 'Deepak Shah',
    memberId: 'EMP010',
    extractedData: {
      patient_name: 'Deepak Shah',
      doctor_name: 'Dr. Iyer',
      doctor_registration: 'TN/56789/2013',
      diagnosis: 'Acute bronchitis',
      medicines: ['Antibiotics', 'Bronchodilators'],
      tests: [],
      treatment_date: new Date('2024-11-03'),
      claim_amount: 4500,
      hospital_name: 'Apollo Hospitals'
    },
    decision: 'APPROVED',
    approvedAmount: 3600,
    confidenceScore: 0.93,
    rejectionReasons: [],
    notes: 'Network hospital with discount applied'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Claim.deleteMany({});
    console.log('Cleared existing claims');

    // Insert seed data
    const insertedClaims = await Claim.insertMany(seedData);
    console.log(`Inserted ${insertedClaims.length} sample claims`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
