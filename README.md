🏥 OPD Claim Adjudication System

«🚀 Live Demo

Experience the application here:

🌐 https://opd-claim-adjudication-three.vercel.app/

This AI-powered platform automates OPD insurance claim adjudication using OCR, Large Language Models, and policy-driven validation. Users can upload medical documents, extract claim information automatically, and receive intelligent approval/rejection decisions with detailed reasoning and confidence scores.»

---

📋 Overview

An AI-powered solution for automating the adjudication (approval/rejection) of Outpatient Department (OPD) insurance claims.

The system eliminates the need for manual claim review by combining:

- OCR Technology for extracting text from medical documents
- AI/LLM Intelligence using Groq Llama 3.3 for data extraction
- Rule-Based Adjudication Engine for policy validation
- Full-Stack Architecture with React, Node.js, and MongoDB Atlas

✨ Features

- 📄 Upload and process OPD claim documents
- 🔍 OCR-based document text extraction
- 🤖 Groq Llama 3.3 powered structured data extraction
- ✅ Automatic claim adjudication
- 📊 Confidence score generation
- 📜 Claims history tracking
- 📈 Admin analytics dashboard
- 📚 Swagger API documentation
- ⚡ Real-time processing workflow
- 🛡️ Fraud detection checks
- 🏥 Coverage and eligibility validation

---

🌐 Live Demo

Application URL

https://opd-claim-adjudication-three.vercel.app/

What You Can Explore

- Submit OPD insurance claims
- Upload prescriptions and bills
- View claim decisions
- Review adjudication reasons
- Browse historical claims
- Access analytics dashboard
- Test OCR and AI extraction workflow

---

🏗️ System Architecture

┌─────────────────────────────────────────────────────┐
│                 React Frontend (Vite)               │
│  - Home | Upload Claim | History | Dashboard        │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────┐
│              Node.js/Express Backend                │
├─────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│ │ File Upload  │  │  OCR Service │  │ Groq       │ │
│ │ (Multer)     │  │(Tesseract.js)│  │ (Llama 3.3)│ │
│ └──────────────┘  └──────────────┘  └────────────┘ │
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │        Adjudication Rules Engine                 ││
│ │  - Policy Validation                             ││
│ │  - Document Validation                           ││
│ │  - Coverage Verification                         ││
│ │  - Limit Validation                              ││
│ │  - Medical Necessity Review                      ││
│ │  - Fraud Detection                               ││
│ └──────────────────────────────────────────────────┘│
└──────────────────┬──────────────────────────────────┘
                   │ MongoDB Connection
┌──────────────────▼──────────────────────────────────┐
│           MongoDB Atlas Database                    │
│  - Claims Collection                               │
│  - Policy Terms                                    │
└─────────────────────────────────────────────────────┘

---

🛠️ Technology Stack

Layer| Technology
Frontend| React + Vite
Backend| Node.js + Express
Database| MongoDB Atlas
OCR| Tesseract.js
AI Engine| Groq Llama 3.3
API Documentation| Swagger
Deployment| Vercel
File Upload| Multer

---

🚀 Getting Started

Prerequisites

- Node.js v16+
- MongoDB Atlas Account
- Groq API Key

---

Installation

1. Clone the Repository

git clone <repository-url>
cd opd-claim-adjudication

2. Backend Setup

cd backend

npm install

cp .env.example .env

Update ".env"

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/opd-claims

OPENAI_API_KEY=gsk_xxxxxxxxxxxxxxxxx

3. Frontend Setup

cd ../frontend

npm install

---

Running the Application

Terminal 1 — Backend

cd backend

npm start

Expected output:

MongoDB connected successfully
Policy loaded successfully
Server running on port 5000
Swagger documentation available at http://localhost:5000/api-docs

Terminal 2 — Frontend

cd frontend

npm run dev

Expected output:

VITE ready

Local: http://localhost:3000/

Terminal 3 — Seed Sample Data

cd backend

npm run seed

---

Application URLs

Service| URL
Live Demo| https://opd-claim-adjudication-three.vercel.app/
Frontend (Local)| http://localhost:3000
Backend API| http://localhost:5000
Swagger Docs| http://localhost:5000/api-docs
Health Check| http://localhost:5000/health

---

📁 Project Structure

opd-claim-adjudication/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── multer.js
│   ├── controllers/
│   │   └── claimController.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Claim.js
│   ├── routes/
│   │   └── claimRoutes.js
│   ├── services/
│   │   ├── ocrService.js
│   │   ├── openaiService.js
│   │   ├── policyService.js
│   │   └── adjudicationEngine.js
│   ├── utils/
│   │   └── helpers.js
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── policy_terms.json
├── test_cases.json
└── README.md

---

🔄 Claim Processing Flow

1. USER UPLOADS DOCUMENTS
   ├── Prescription
   ├── Bill
   ├── Diagnostic Report
   └── Pharmacy Bill

2. FILE VALIDATION
   └── Format, Size, Presence Check

3. OCR PROCESSING
   └── Tesseract.js extracts text

4. AI EXTRACTION
   └── Groq Llama 3.3 extracts:
       ├── Patient Name
       ├── Doctor Name
       ├── Registration Number
       ├── Diagnosis
       ├── Medicines
       ├── Tests
       ├── Treatment Date
       ├── Claim Amount
       └── Hospital Name

5. ADJUDICATION ENGINE
   ├── Eligibility Check
   ├── Document Validation
   ├── Coverage Verification
   ├── Limit Validation
   ├── Medical Necessity Review
   ├── Fraud Detection
   └── Manual Review Check

6. DECISION GENERATION
   ├── APPROVED
   ├── REJECTED
   ├── PARTIAL
   └── MANUAL_REVIEW

7. RESPONSE
   └── Decision + Confidence + Reasons

---

🔧 Configuration

Environment Variables

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/opd-claims

OPENAI_API_KEY=gsk_xxx...

---

Policy Terms

The system dynamically loads rules from:

policy_terms.json

Contains:

- Coverage limits
- Waiting periods
- Exclusions
- Co-pay information
- Network hospital benefits
- Cashless rules

---

Test Cases

test_cases.json

Includes:

- Simple approvals
- Partial approvals
- Waiting period violations
- Missing document scenarios
- Fraud detection
- Excluded treatments

---

📊 API Endpoints

Upload Claim

POST /api/claims/upload

Request

memberName
memberId
prescription
bill
diagnosticReport
pharmacyBill

Response

{
  "success": true,
  "claim": {
    "claimId": "CLM_123",
    "decision": "APPROVED",
    "approvedAmount": 1350,
    "confidenceScore": 0.95,
    "rejectionReasons": []
  }
}

---

Get All Claims

GET /api/claims

---

Get Claim Details

GET /api/claims/:id

---

Delete Claim

DELETE /api/claims/:id

---

Statistics

GET /api/claims/statistics/all

Response:

{
  "totalClaims": 10,
  "approvedClaims": 7,
  "rejectedClaims": 2,
  "partialClaims": 1,
  "approvalRate": "70.00"
}

---

🧪 Testing

Seed Sample Data

cd backend

npm run seed

---

Test Cases Covered

Test Case| Scenario| Expected Result
TC001| Simple Consultation| Approved
TC002| Dental Treatment| Partial Approval
TC003| Limit Exceeded| Rejected
TC004| Missing Documents| Rejected
TC005| Waiting Period Violation| Rejected
TC006| Alternative Medicine| Approved
TC007| Diagnostic Tests| Pre-Auth Required
TC008| Fraud Detection| Manual Review
TC009| Excluded Treatment| Rejected
TC010| Network Hospital Benefit| Approved

---

📱 Frontend Pages

🏠 Home

- Project overview
- Feature highlights
- Statistics cards
- Navigation shortcuts

📤 Upload Claim

- Member details form
- Document uploads
- Progress indicators
- Validation feedback

📜 Claims History

- Claims listing
- Filtering
- Sorting
- Pagination

🔍 Claim Details

- Claim information
- Extracted fields
- Decision summary
- Rejection reasons

📈 Admin Dashboard

- Approval statistics
- Claim distribution
- Recent claims
- Analytics

---

🛡️ Error Handling

The system gracefully handles:

- Invalid file formats
- OCR extraction failures
- MongoDB connection issues
- API failures
- Missing required fields
- Corrupted uploads
- Invalid responses

---

🎨 UI Design

- Pure CSS
- No Tailwind CSS
- No Bootstrap
- Fully Responsive
- Mobile Friendly
- Semantic HTML
- Accessible Components

---

🚨 Important Notes

Local Development

Designed primarily as an MVP and academic demonstration project.

API Keys Required

Groq

Used for:

- Data extraction
- Structured claim generation
- AI reasoning

MongoDB Atlas

Used for:

- Claims storage
- Policy storage
- Statistics generation

---

File Upload Constraints

- Maximum Size: 10 MB
- Formats:
  - PDF
  - PNG
  - JPG
  - JPEG

Storage Location:

backend/uploads

---

Performance

Process| Time
OCR| 5–10 sec
AI Extraction| 1–3 sec
Full Claim Processing| ~30 sec

---

📚 Resources

MongoDB Atlas:
https://www.mongodb.com/cloud/atlas

Groq:
https://console.groq.com/

Tesseract.js:
https://github.com/naptha/tesseract.js

Express:
https://expressjs.com/

React:
https://react.dev/

Vite:
https://vitejs.dev/

---

🐛 Troubleshooting

MongoDB Connection Failed

- Verify MONGO_URI
- Check Atlas IP Whitelist
- Check internet connectivity

Groq API Errors

- Verify API key
- Check quota limits
- Confirm model availability

Upload Issues

- File size below 10 MB
- Supported formats only
- Uploads folder exists

OCR Problems

- Verify Tesseract installation
- Check image quality
- Ensure readable documents

Frontend Connectivity Issues

- Backend running on port 5000
- Correct proxy configuration
- CORS enabled

---

📖 Documentation

Swagger Documentation:

http://localhost:5000/api-docs

Important Files:

backend/routes/claimRoutes.js
backend/models/Claim.js
policy_terms.json
backend/services/adjudicationEngine.js

---

💡 Future Enhancements

Add New Policy Rules

Update:

policy_terms.json
adjudicationEngine.js

Add New Document Types

Update:

- multer configuration
- database schema
- upload handler
- frontend forms

Improve AI Extraction

Enhance prompts inside:

openaiService.js

Add Advanced Analytics

Create:

- Reporting APIs
- Dashboard charts
- Claim trends analysis

---

📝 License

This project is developed for educational, demonstration, and learning purposes.

---

👨‍💻 Author

Built with ❤️ for automating OPD insurance claim adjudication using OCR, AI, and rule-based decision systems.

Live Demo

🌐 https://opd-claim-adjudication-three.vercel.app/