# 🏥 OPD Claim Adjudication System

An AI-powered solution for automating the adjudication (approval/rejection) of Outpatient Department (OPD) insurance claims.

## 📋 Overview

This system automates the manual process of reviewing insurance claims against policy terms and adjudication rules. It combines:
- **OCR Technology**: Extracts text from medical documents
- **AI/LLM**: Groq Llama 3.3 for intelligent data extraction
- **Rule Engine**: Policy-based validation and decision making
- **Full-Stack Application**: React frontend + Node.js backend

## ✨ Features

- **Document Processing**: Upload and process medical documents (prescriptions, bills, diagnostic reports, pharmacy bills)
- **Intelligent Extraction**: OCR + Groq Llama 3.3 powered data extraction
- **Smart Validation**: Policy-based claim validation
- **Automatic Decisions**: APPROVED, REJECTED, PARTIAL, or MANUAL_REVIEW
- **Confidence Scoring**: AI confidence metrics for each decision
- **Claims History**: Track all submitted claims
- **Admin Dashboard**: Analytics and statistics
- **Swagger API**: Complete API documentation

## 🏗️ Architecture

```
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
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16 or higher
- **MongoDB**: Atlas account (free tier available at mongodb.com)
- **Groq API**: Account with API key (console.groq.com)

### Installation

#### 1. Clone/Extract the Project

```bash
cd opd-claim-adjudication
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - MONGO_URI: Your MongoDB Atlas connection string
# - OPENAI_API_KEY: Your Groq API key (configured inside the backend env)
# - PORT: 5000 (default)
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### Running the Application

#### Terminal 1: Start Backend

```bash
cd backend
npm start
```

Expected output:
```
MongoDB connected successfully
Policy loaded successfully
Server running on port 5000
Swagger documentation available at http://localhost:5000/api-docs
```

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

#### Terminal 3 (Optional): Seed Sample Data

```bash
cd backend
npm run seed
```

This inserts 10 sample claims for testing.

### Accessing the Application

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
opd-claim-adjudication/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── multer.js            # File upload configuration
│   ├── controllers/
│   │   └── claimController.js   # API controllers
│   ├── middlewares/
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   └── Claim.js             # MongoDB schema
│   ├── routes/
│   │   └── claimRoutes.js       # API routes
│   ├── services/
│   │   ├── ocrService.js        # Tesseract OCR
│   │   ├── openaiService.js     # Groq extraction service
│   │   ├── policyService.js     # Policy rules
│   │   └── adjudicationEngine.js # Decision logic
│   ├── utils/
│   │   └── helpers.js           # Utility functions
│   ├── uploads/                 # Uploaded documents
│   ├── app.js                   # Express app
│   ├── server.js                # Server entry point
│   ├── seed.js                  # Sample data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Home page
│   │   │   ├── ClaimUpload.jsx      # Upload page
│   │   │   ├── ClaimsHistory.jsx    # History page
│   │   │   ├── ClaimDetails.jsx     # Details page
│   │   │   └── AdminDashboard.jsx   # Dashboard
│   │   ├── components/              # Reusable components
│   │   ├── services/
│   │   │   └── api.js              # API client
│   │   ├── styles/
│   │   │   └── index.css           # Global styles
│   │   ├── App.jsx                 # Main app
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── policy_terms.json              # Insurance policy configuration
├── test_cases.json                # Test cases
└── README.md
```

## 🔄 Claim Processing Flow

```
1. USER UPLOADS DOCUMENTS
   ├── Prescription (PDF/Image)
   ├── Bill (PDF/Image)
   ├── Diagnostic Report (PDF/Image)
   └── Pharmacy Bill (PDF/Image)
   
2. FILE VALIDATION
   └── Check: Format, Size, Presence
   
3. OCR PROCESSING
   └── Tesseract.js extracts text from documents
   
4. AI EXTRACTION
   └── Groq Llama 3.3 extracts structured data:
       ├── Patient Name
       ├── Doctor Name
       ├── Doctor Registration
       ├── Diagnosis
       ├── Medicines
       ├── Tests
       ├── Treatment Date
       ├── Claim Amount
       └── Hospital Name
       
5. ADJUDICATION ENGINE
   ├── Step 1: Eligibility Check
   │  └── Policy Active? Member Covered? Waiting Period OK?
   ├── Step 2: Document Validation
   │  └── All required docs present? Doctor reg valid?
   ├── Step 3: Coverage Verification
   │  └── Is treatment covered? Check exclusions
   ├── Step 4: Limit Validation
   │  └── Within annual/per-claim limits?
   ├── Step 5: Medical Necessity
   │  └── Does treatment justify diagnosis?
   ├── Step 6: Fraud Detection
   │  └── Any suspicious patterns?
   └── Step 7: Manual Review?
      └── High value? Low confidence? Complex?
      
6. DECISION GENERATION
   ├── APPROVED: ✓ All checks passed
   ├── REJECTED: ✗ One or more checks failed
   ├── PARTIAL: ⚡ Some items approved, some not
   └── MANUAL_REVIEW: ⚠️ Needs human review
   
7. RESPONSE
   └── Decision + Amount + Confidence + Reasons
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/opd-claims

# Groq
OPENAI_API_KEY=gsk_xxx...
```

### Policy Terms (policy_terms.json)

The system loads policy rules dynamically from `policy_terms.json`:
- Coverage details (limits, copay, sub-limits)
- Waiting periods
- Exclusions
- Network hospitals
- Cashless facilities

### Test Cases (test_cases.json)

Includes 10 comprehensive test cases covering:
- Simple approvals
- Partial approvals
- Rejections
- Missing documents
- Waiting period violations
- Alternative medicine
- Pre-auth requirements
- Fraud detection
- Excluded treatments
- Network hospital benefits

## 📊 API Endpoints

### Upload Claim
```
POST /api/claims/upload
Content-Type: multipart/form-data

Body:
- memberName: string (required)
- memberId: string (required)
- prescription: file (optional)
- bill: file (optional)
- diagnosticReport: file (optional)
- pharmacyBill: file (optional)

Response:
{
  "success": true,
  "claim": {
    "claimId": "CLM_...",
    "decision": "APPROVED|REJECTED|PARTIAL|MANUAL_REVIEW",
    "approvedAmount": 1350,
    "confidenceScore": 0.95,
    "rejectionReasons": [],
    "notes": "..."
  }
}
```

### Get All Claims
```
GET /api/claims

Response:
{
  "success": true,
  "claims": [...]
}
```

### Get Claim Details
```
GET /api/claims/{id}

Response:
{
  "success": true,
  "claim": {...}
}
```

### Delete Claim
```
DELETE /api/claims/{id}

Response:
{
  "success": true,
  "message": "Claim deleted successfully"
}
```

### Get Statistics
```
GET /api/claims/statistics/all

Response:
{
  "success": true,
  "statistics": {
    "totalClaims": 10,
    "approvedClaims": 7,
    "rejectedClaims": 2,
    "partialClaims": 1,
    "manualReviewClaims": 0,
    "approvalRate": "70.00",
    "totalApprovedAmount": 15450
  }
}
```

## 🧪 Testing

### Test with Sample Data

```bash
# Seed database with 10 test cases
cd backend
npm run seed
```

Then visit http://localhost:3000/history to view sample claims.

### Manual Testing

1. **Approve Claim**: Upload valid documents with all info
2. **Reject Claim**: Upload missing prescription
3. **Partial Approve**: Upload dental claim with cosmetic procedure
4. **Fraud Detection**: Submit multiple claims quickly

### Test Cases Covered

- ✅ TC001: Simple Consultation - Approved
- ✅ TC002: Dental Treatment - Partial Approval
- ✅ TC003: Limit Exceeded - Rejected
- ✅ TC004: Missing Documents - Rejected
- ✅ TC005: Pre-existing Condition - Waiting Period
- ✅ TC006: Alternative Medicine - Approved
- ✅ TC007: Diagnostic Tests - Pre-auth Required
- ✅ TC008: Fraud Detection - Manual Review
- ✅ TC009: Excluded Treatment - Rejected
- ✅ TC010: Network Hospital - Cashless Approved

## 🛡️ Error Handling

The system handles:
- Missing/invalid files
- OCR extraction failures
- OpenAI API errors
- MongoDB connection issues
- Invalid document formats
- Malformed extraction responses
- Missing required fields

All errors return clear messages to help users understand what went wrong.

## 📱 Frontend Pages

### Home
- Project overview
- Key statistics
- Feature highlights
- Quick navigation

### Upload Claim
- Form for member details
- File upload for 4 document types
- Real-time file validation
- Upload progress indicator
- Success/error feedback

### Claims History
- Table of all claims
- Sort by date
- Filter by decision
- View/Delete actions
- Pagination support

### Claim Details
- Full claim information
- Extracted data display
- Decision summary
- Rejection reasons
- Document references
- Timeline/metadata

### Admin Dashboard
- Key metrics (total, approved, rejected)
- Approval rate
- Decision distribution
- Recent claims table
- Top members by claims
- System information

## 🎨 Design

- **Pure CSS**: No UI libraries (Tailwind, Bootstrap, Material-UI)
- **Responsive**: Works on desktop, tablet, mobile
- **Accessible**: Semantic HTML, proper colors
- **Modern**: Grid layout, flexbox, cards
- **Icons**: Emoji for visual appeal

## 🚨 Important Notes

### Local Development Only
This MVP is designed to run locally on your machine:
- No deployment/production configurations
- No Docker/Kubernetes
- No CI/CD pipelines
- Local file uploads only

### API Keys Required
- **Groq**: Required for data extraction (llama-3.3-70b-versatile model)
- **MongoDB**: Required for data persistence
- Both need valid credentials in .env

### File Upload Limits
- Maximum file size: 10 MB per file
- Supported formats: PDF, PNG, JPG, JPEG
- Files stored in: `backend/uploads/`

### Performance
- OCR processing: ~5-10 seconds per document
- Groq Llama 3.3 extraction: ~1-3 seconds
- Total processing: ~30 seconds for full claim

## 📚 Resources

- **MongoDB**: https://www.mongodb.com/cloud/atlas
- **Groq**: https://console.groq.com/
- **Tesseract.js**: https://github.com/naptha/tesseract.js
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check connection string in .env
- Verify IP whitelist on MongoDB Atlas
- Ensure network connectivity

### Groq API Errors
- Verify API key is correct
- Check API usage/quota
- Ensure model is available (llama-3.3-70b-versatile)

### File Upload Issues
- Check file format (PDF/PNG/JPG)
- Verify file size < 10 MB
- Ensure `backend/uploads/` directory exists

### OCR Not Working
- Verify Tesseract.js is installed
- Check file is readable/not corrupted
- Try with sample documents

### Frontend Not Connecting
- Verify backend is running on port 5000
- Check proxy configuration in vite.config.js
- Verify CORS is enabled

## 📖 Documentation

- **Swagger UI**: http://localhost:5000/api-docs
- **API Routes**: See [backend/routes/claimRoutes.js](backend/routes/claimRoutes.js)
- **Data Models**: See [backend/models/Claim.js](backend/models/Claim.js)
- **Policy Rules**: See [policy_terms.json](policy_terms.json)
- **Adjudication Logic**: See [backend/services/adjudicationEngine.js](backend/services/adjudicationEngine.js)

## 💡 How to Extend

### Add New Policy Rules
Edit `policy_terms.json` and `adjudicationEngine.js`

### Add New Document Types
1. Update `multer.js` file filter
2. Add field to `Claim.js` schema
3. Update `claimController.js` upload handler
4. Update frontend form

### Improve AI Extraction
Edit prompt in `openaiService.js` to extract more/different fields

### Add Statistics/Reports
Create new endpoints in `claimController.js` and corresponding frontend pages

## 📝 License

This project is for demonstration/learning purposes.

---

**Built with ❤️ for claim automation**
