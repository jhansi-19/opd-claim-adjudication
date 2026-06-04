# ⚡ Quick Start Guide

Get the OPD Claim Adjudication System running in **5 minutes**.

## 🎯 Prerequisites

Before starting, ensure you have:

1. **Node.js** installed (https://nodejs.org) - version 16+
2. **MongoDB Atlas** account (https://mongodb.com/cloud/atlas) - free tier OK
3. **OpenAI API Key** (https://platform.openai.com)

## 🚀 5-Minute Setup

### Step 1: Create .env File (30 seconds)

Navigate to `backend/` folder and create `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/opd-claims?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-api-key
NODE_ENV=development
```

Replace with your actual credentials.

### Step 2: Install & Start Backend (2 minutes)

```bash
cd backend
npm install
npm start
```

Wait for message: `Server running on port 5000`

### Step 3: Install & Start Frontend (2 minutes)

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Wait for message: `Local: http://localhost:3000/`

### Step 4: Open in Browser (30 seconds)

```
http://localhost:3000
```

✅ **Done!** System is running.

---

## 🧪 Quick Test

1. Click **"Upload Claim"**
2. Enter:
   - Name: `Test User`
   - ID: `EMP001`
3. Upload any document (or create dummy files)
4. Click **"Process Claim"**
5. See decision in ~30 seconds

---

## 🎓 Common Tasks

### View Sample Data
```bash
cd backend
npm run seed
```
Then go to: http://localhost:3000/history

### View API Documentation
Visit: http://localhost:5000/api-docs

### Stop Everything
Press `Ctrl+C` in both terminals

### Restart
```bash
# Terminal 1
npm start

# Terminal 2 (new)
npm run dev
```

---

## ⚙️ Configuration

### MongoDB Atlas Setup (2 min)
1. Go to https://mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Create user with password
5. Get connection string from "Connect" button
6. Paste in `.env` MONGO_URI

### OpenAI API Key (1 min)
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy entire key (starts with `sk-`)
4. Paste in `.env` OPENAI_API_KEY

---

## 📊 What Works

✅ Upload & process claims  
✅ View claim history  
✅ See detailed decisions  
✅ Admin dashboard with stats  
✅ Sample data seeding  
✅ API documentation  
✅ Error handling  

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` | Check MongoDB connection string in `.env` |
| `Invalid API key` | Verify OpenAI key starts with `sk-` |
| `Port 5000 in use` | Kill process: `lsof -i :5000 \| kill -9` |
| `Port 3000 in use` | Kill process: `lsof -i :3000 \| kill -9` |
| No data in dashboard | Run: `npm run seed` |
| Files not uploading | Check file size < 10MB |

---

## 📁 Project Structure

```
opd-claim-adjudication/
├── backend/          ← API server (port 5000)
│   ├── .env          ← Your config (create this!)
│   └── package.json
├── frontend/         ← React app (port 3000)
│   └── package.json
└── README.md         ← Full documentation
```

---

## 🔗 Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main application |
| http://localhost:5000/health | API health check |
| http://localhost:5000/api-docs | API documentation |

---

## ✨ Features Included

- **OCR**: Document text extraction with Tesseract.js
- **AI**: GPT-4o powered data extraction
- **Rules Engine**: Policy-based claim validation
- **Database**: MongoDB for data persistence
- **Frontend**: React with routing and styling
- **API**: Complete REST API with Swagger docs
- **Seed Data**: 10 test cases pre-loaded
- **Error Handling**: Comprehensive error messages

---

## 🚨 Important Notes

1. **Local Only**: This is a local MVP, not production-ready
2. **API Keys**: Keep `.env` secure, never commit to Git
3. **Database**: MongoDB free tier is sufficient for testing
4. **Processing**: Claims take 30-60 seconds to process (OCR + AI)
5. **File Uploads**: Stored in `backend/uploads/` locally

---

## 📚 Full Documentation

For detailed guides, see:
- `SETUP_GUIDE.md` - Complete step-by-step setup
- `README.md` - Full documentation
- `TEST_CASES.md` - Test case descriptions
- API Docs: http://localhost:5000/api-docs

---

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB Atlas connected
- [ ] OpenAI API key obtained
- [ ] `.env` file created with credentials
- [ ] Backend running on 5000
- [ ] Frontend running on 3000
- [ ] Can access http://localhost:3000
- [ ] Can upload a test claim
- [ ] Dashboard shows statistics

---

**You're ready! 🎉 Visit http://localhost:3000**

Need help? Check `SETUP_GUIDE.md` for detailed troubleshooting.
