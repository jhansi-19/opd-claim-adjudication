# 🧪 Test Cases Documentation

This document describes the 10 test cases included in `test_cases.json` with expected outcomes.

## Test Case Overview

| ID | Name | Decision | Purpose |
|----|------|----------|---------|
| TC001 | Simple Consultation | APPROVED | Basic successful claim |
| TC002 | Dental Treatment | PARTIAL | Mixed coverage scenario |
| TC003 | Limit Exceeded | REJECTED | Per-claim limit violation |
| TC004 | Missing Documents | REJECTED | Documentation validation |
| TC005 | Pre-existing Condition | REJECTED | Waiting period validation |
| TC006 | Alternative Medicine | APPROVED | Coverage type validation |
| TC007 | Diagnostic Tests | REJECTED | Pre-auth requirement |
| TC008 | Fraud Detection | MANUAL_REVIEW | Suspicious pattern detection |
| TC009 | Excluded Treatment | REJECTED | Exclusion list validation |
| TC010 | Network Hospital | APPROVED | Network benefits validation |

---

## Detailed Test Cases

### TC001: Simple Consultation - Approved ✅

**Scenario:**
Regular doctor consultation for viral fever with standard tests.

**Input:**
```
Member: Rajesh Kumar (EMP001)
Diagnosis: Viral fever
Doctor: Dr. Sharma (KA/45678/2015)
Amount: ₹1,500
Medicines: Paracetamol 650mg, Vitamin C
Tests: CBC, Dengue test
```

**Expected Output:**
```
Decision: APPROVED
Approved Amount: ₹1,350 (10% copay deducted)
Confidence: 95%
Rejection Reasons: None
```

**Why Approved:**
- ✅ Policy active
- ✅ All documents valid
- ✅ Within limits (₹5,000 per claim, ₹50,000 annual)
- ✅ Medically necessary
- ✅ Doctor registration valid

---

### TC002: Dental Treatment - Partial Approval ⚡

**Scenario:**
Root canal (covered) + teeth whitening (cosmetic, excluded).

**Input:**
```
Member: Priya Singh (EMP002)
Diagnosis: Tooth decay requiring root canal
Doctor: Dr. Patel (MH/23456/2018)
Amount: ₹12,000 (₹8,000 root canal + ₹4,000 whitening)
Procedures: Root canal treatment, Teeth whitening
```

**Expected Output:**
```
Decision: PARTIAL
Approved Amount: ₹8,000 (root canal only)
Rejected Items: Teeth whitening (cosmetic procedure)
Confidence: 92%
```

**Why Partial:**
- ✅ Root canal is covered
- ✗ Teeth whitening is cosmetic (excluded)
- ✅ Approved amount within limits

---

### TC003: Limit Exceeded - Rejected ❌

**Scenario:**
Claim amount exceeds per-claim limit of ₹5,000.

**Input:**
```
Member: Amit Verma (EMP003)
Diagnosis: Gastroenteritis
Doctor: Dr. Gupta (DL/34567/2016)
Amount: ₹7,500
```

**Expected Output:**
```
Decision: REJECTED
Rejection Reasons: [PER_CLAIM_EXCEEDED]
Confidence: 98%
Message: "Claim exceeds per-claim limit of ₹5,000"
```

**Why Rejected:**
- ✗ ₹7,500 > ₹5,000 per-claim limit
- This is a hard rule that cannot be exceeded

---

### TC004: Missing Documents - Rejected ❌

**Scenario:**
Bill submitted but prescription missing (required document).

**Input:**
```
Member: Sneha Reddy (EMP004)
Amount: ₹2,000
Documents: Bill only (NO prescription)
```

**Expected Output:**
```
Decision: REJECTED
Rejection Reasons: [MISSING_DOCUMENTS]
Confidence: 100%
Message: "Prescription from registered doctor is required"
```

**Why Rejected:**
- ✗ Prescription is mandatory
- ✗ Cannot extract doctor information
- Cannot proceed without doctor registration

---

### TC005: Pre-existing Condition - Waiting Period ⏳

**Scenario:**
Diabetes treatment within 90-day waiting period from policy start.

**Input:**
```
Member: Vikram Joshi (EMP005)
Join Date: 2024-09-01
Treatment Date: 2024-10-15 (only 44 days after joining)
Diagnosis: Type 2 Diabetes (90-day waiting period)
Amount: ₹3,000
```

**Expected Output:**
```
Decision: REJECTED
Rejection Reasons: [WAITING_PERIOD]
Confidence: 96%
Message: "Diabetes has 90-day waiting period. Eligible from 2024-11-30"
```

**Why Rejected:**
- ✗ Diabetes requires 90-day waiting period
- ✗ Only 44 days have elapsed
- ✅ Will be eligible from 2024-11-30

---

### TC006: Alternative Medicine - Approved ✅

**Scenario:**
Ayurvedic treatment for joint pain (covered alternative medicine).

**Input:**
```
Member: Kavita Nair (EMP006)
Diagnosis: Chronic joint pain
Doctor: Vaidya Krishnan (AYUR/KL/2345/2019)
Treatment: Panchakarma therapy
Amount: ₹4,000
Sub-limit: ₹8,000 (alternative medicine)
```

**Expected Output:**
```
Decision: APPROVED
Approved Amount: ₹4,000
Confidence: 89%
Note: "Alternative medicine covered under policy"
```

**Why Approved:**
- ✅ Ayurveda is in covered treatments list
- ✅ Within alternative medicine sub-limit (₹8,000)
- ✅ All documents valid
- ✅ Within per-claim limit

---

### TC007: Diagnostic Tests - Pre-auth Required ❌

**Scenario:**
MRI scan without pre-authorization (required for high-value diagnostic tests).

**Input:**
```
Member: Suresh Patil (EMP007)
Diagnosis: Suspected lumbar disc herniation
Doctor: Dr. Rao (AP/67890/2017)
Test: MRI Lumbar Spine
Amount: ₹15,000
Pre-auth Required: YES (for tests > ₹10,000)
```

**Expected Output:**
```
Decision: REJECTED
Rejection Reasons: [PRE_AUTH_MISSING]
Confidence: 94%
Message: "MRI requires pre-authorization for claims above ₹10,000"
```

**Why Rejected:**
- ✗ MRI is ₹15,000 (exceeds ₹10,000 threshold)
- ✗ Pre-authorization is required but not provided
- Alternative: Apply for pre-auth first, then resubmit

---

### TC008: Fraud Detection - Manual Review ⚠️

**Scenario:**
Multiple high-value claims from same member on same day (fraud indicator).

**Input:**
```
Member: Ravi Menon (EMP008)
Treatment Date: 2024-10-30
Number of Claims: 4 claims on same day
Diagnosis: Migraine
Amount: ₹4,800
Red Flags: Multiple claims same day, unusual pattern
```

**Expected Output:**
```
Decision: MANUAL_REVIEW
Flags: ["Multiple claims same day", "Unusual pattern detected"]
Confidence: 65% (below 70% threshold)
Message: "Potential fraud indicators detected"
```

**Why Manual Review:**
- ⚠️ Multiple claims same day (fraud indicator)
- ⚠️ Confidence score < 70%
- Needs human verification before approval

---

### TC009: Excluded Treatment - Rejected ❌

**Scenario:**
Weight loss treatment (explicitly excluded from coverage).

**Input:**
```
Member: Anita Desai (EMP009)
Diagnosis: Obesity - BMI 35
Doctor: Dr. Banerjee (WB/34567/2015)
Treatment: Bariatric consultation and diet plan
Amount: ₹8,000
```

**Expected Output:**
```
Decision: REJECTED
Rejection Reasons: [SERVICE_NOT_COVERED]
Confidence: 97%
Message: "Weight loss treatments are excluded from coverage"
```

**Why Rejected:**
- ✗ Weight loss treatments are in exclusions list
- ✗ Policy explicitly excludes this category
- Alternative: Check if covered under other insurance plans

---

### TC010: Network Hospital - Cashless Approved ✅

**Scenario:**
Treatment at network hospital (Apollo) qualifies for cashless benefit and discount.

**Input:**
```
Member: Deepak Shah (EMP010)
Hospital: Apollo Hospitals (network provider)
Diagnosis: Acute bronchitis
Doctor: Dr. Iyer (TN/56789/2013)
Amount: ₹4,500
Network Discount: 20%
```

**Expected Output:**
```
Decision: APPROVED
Approved Amount: ₹3,600 (20% network discount applied)
Cashless Approved: YES
Confidence: 93%
Benefits: "Network hospital discount applied"
```

**Why Approved:**
- ✅ Apollo is network hospital
- ✅ Qualifies for 20% network discount
- ✅ Cashless facility available
- ✅ All documents valid
- ✅ Within limits

---

## 📊 Decision Matrix

```
                      APPROVED  REJECTED  PARTIAL  MANUAL_REVIEW
TC001  Consultation     ✅
TC002  Dental                                ✅
TC003  Limit                    ✅
TC004  Documents                ✅
TC005  Waiting                  ✅
TC006  Alt Medicine     ✅
TC007  Pre-auth                 ✅
TC008  Fraud                                           ✅
TC009  Excluded                 ✅
TC010  Network          ✅
```

---

## 🔑 Key Validation Rules Tested

| Rule | Tested By |
|------|-----------|
| Eligibility Check | TC001, TC004, TC005 |
| Document Validation | TC004, TC005 |
| Coverage Verification | TC002, TC006, TC009 |
| Limit Validation | TC003, TC010 |
| Medical Necessity | TC001, TC006 |
| Fraud Detection | TC008 |
| Network Benefits | TC010 |
| Pre-auth Requirements | TC007 |

---

## 🧪 How to Test Manually

### Using Test Cases

1. Go to http://localhost:3000
2. Click "Upload Claim"
3. Fill member details from test case
4. Upload sample documents (or create mock files)
5. Submit

### Quick Test with Seed Data

```bash
# Run this to populate 10 test cases
cd backend
npm run seed
```

Then go to http://localhost:3000/history to see results.

### Verify Decisions

Compare actual system decisions with expected outputs:

- **Approved Claims**: Should show amount and 95%+ confidence
- **Rejected Claims**: Should list rejection reasons
- **Partial Claims**: Should show approved portion
- **Manual Review**: Should flag as suspicious

---

## 📝 Notes for Testing

1. **Test Case TC001** - Best starting point (simple approval)
2. **Test Case TC008** - Requires multiple submissions quickly
3. **Test Case TC005** - Tests date validation (requires future date)
4. **Test Case TC002** - Tests partial approval logic
5. **Test Case TC007** - Tests pre-auth validation

---

## 🎯 Coverage

These 10 test cases cover:
- ✅ Happy path (approval)
- ✅ Rejection scenarios (5 types)
- ✅ Partial approval
- ✅ Manual review (fraud detection)
- ✅ All major policy rules
- ✅ All rejection categories

---

**Test thoroughly before production deployment!**
