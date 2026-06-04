# 🚀 Complete Setup Guide

A step-by-step guide to get the OPD Claim Adjudication System running on your local machine.

## ⏱️ Estimated Time: 15 minutes

---

## Step 1: Prerequisites Check

### Install Node.js (if not already installed)
1. Go to https://nodejs.org/ (LTS version recommended)
2. Download and install
3. Verify installation:
```bash
node --version
npm --version
```

### Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a cluster (free M0 tier is sufficient)
4. Create a database user with password
5. Add your IP to network access (or use 0.0.0.0/0 for development)
6. Get your connection string

Example URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/opd-claims?retryWrites=true&w=majority
```

### Get OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API keys
4. Create a new secret key
5. Copy and save it securely (won't be shown again)

---

## Step 2: Extract Project Files

1. Extract `opd-claim-adjudication.zip` to your desired location
2. Open terminal/command prompt in the project folder

```bash
cd opd-claim-adjudication
```

---

## Step 3: Configure Backend

### 3.1 Navigate to Backend
```bash
cd backend
```

### 3.2 Create Environment File
Create a file named `.env` in the `backend` directory:

```bash
# Windows PowerShell
New-Item .env

# Mac/Linux
touch .env
```

### 3.3 Edit .env File
Open `.env` in your text editor and paste:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/opd-claims?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-api-key-here
NODE_ENV=development
```

**Replace:**
- `your_username`: Your MongoDB Atlas username
- `your_password`: Your MongoDB Atlas password
- `your_cluster`: Your MongoDB cluster name
- `sk-your-api-key-here`: Your OpenAI API key

### 3.4 Install Dependencies
```bash
npm install
```

Expected output (should complete in ~2-3 minutes):
```
up to date, audited XXX packages
```

---

## Step 4: Test Backend

### 4.1 Start MongoDB Connection
Ensure MongoDB Atlas is running and accessible with your connection string.

### 4.2 Start Backend Server
```bash
npm start
```

Expected output:
```
MongoDB connected successfully
Policy loaded successfully
Server running on port 5000
Swagger documentation available at http://localhost:5000/api-docs
```

### 4.3 Test API Health
In a new terminal, run:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

✅ Backend is running! Keep this terminal open.

---

## Step 5: Configure Frontend

### 5.1 Open New Terminal
Open a new terminal/command prompt window.

### 5.2 Navigate to Frontend
```bash
cd opd-claim-adjudication/frontend
```

### 5.3 Install Dependencies
```bash
npm install
```

Expected output (should complete in ~2-3 minutes):
```
up to date, audited XXX packages
```

---

## Step 6: Start Frontend

### 6.1 Run Development Server
```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

✅ Frontend is running!

---

## Step 7: Access Application

Open your browser and navigate to:

### Main Application
**http://localhost:3000**

You should see:
- Home page with statistics
- Navigation menu
- Feature highlights

### API Documentation (Swagger)
**http://localhost:5000/api-docs**

You should see:
- All available API endpoints
- Request/response schemas
- Try-it-out feature

---

## Step 8: Seed Sample Data (Optional)

To populate the database with 10 sample claims for testing:

### 8.1 Open New Terminal
Open a new terminal window.

### 8.2 Navigate to Backend
```bash
cd opd-claim-adjudication/backend
```

### 8.3 Run Seed Script
```bash
npm run seed
```

Expected output:
```
Cleared existing claims
Inserted 10 sample claims
```

### 8.4 View Sample Claims
Go to http://localhost:3000/history - you should see 10 claims!

---

## Step 9: Test the System

### 9.1 Upload a New Claim

1. Go to http://localhost:3000
2. Click "Upload Claim"
3. Fill in:
   - Member Name: `Test User`
   - Member ID: `EMP001`
4. Upload sample documents (or create simple text files with .pdf extension)
5. Click "Process Claim"
6. Wait 30-60 seconds for processing
7. See the decision result

### 9.2 View Claims History

1. Go to http://localhost:3000/history
2. See all submitted claims
3. Click "View" to see details
4. Click "Delete" to remove

### 9.3 Admin Dashboard

1. Go to http://localhost:3000/dashboard
2. See statistics and analytics
3. View recent claims
4. Check top members

---

## ✅ Troubleshooting

### Backend Won't Start

**Error: `ECONNREFUSED` on MongoDB**
- Check MongoDB Atlas connection string
- Verify IP is whitelisted (use 0.0.0.0/0 for development)
- Check username/password are correct
- Ensure `.env` file exists with `MONGO_URI`

**Error: `Invalid API key`**
- Go to https://platform.openai.com/account/api-keys
- Create a new API key
- Copy the full key (including `sk-` prefix)
- Update `OPENAI_API_KEY` in `.env`

### Frontend Won't Start

**Error: `EADDRINUSE` port 3000 already in use**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

**Error: Cannot connect to API**
- Check backend is running on port 5000
- Check vite.config.js proxy settings
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### Files/Documents

**Error: `File too large`**
- Max file size is 10 MB
- Compress documents or use smaller files

**Error: `Unsupported file format`**
- Accepted formats: PDF, PNG, JPG, JPEG
- Save documents in supported format

### No Data in Dashboard

**If no claims show up:**
1. Run: `npm run seed` (in backend folder)
2. Refresh page
3. Should see 10 sample claims

---

## 📊 What Each Terminal Should Show

### Terminal 1: Backend
```
MongoDB connected successfully
Policy loaded successfully
Server running on port 5000
Swagger documentation available at http://localhost:5000/api-docs
```

### Terminal 2: Frontend
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

### Terminal 3: Seed (one-time)
```
Cleared existing claims
Inserted 10 sample claims
```

---

## 🧪 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api-docs
- [ ] Can upload a claim (shows processing spinner)
- [ ] Can view claims history
- [ ] Can view admin dashboard
- [ ] Statistics showing on home page

---

## 📁 Important Files to Know

```
opd-claim-adjudication/
├── backend/
│   ├── .env                       ← Your configuration goes here
│   ├── server.js                  ← Main backend file
│   ├── package.json               ← Dependencies
│   └── seed.js                    ← Sample data script
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ← Main app component
│   │   └── pages/                 ← Page components
│   ├── vite.config.js             ← Vite configuration
│   └── package.json               ← Dependencies
│
└── README.md                       ← Full documentation
```

---

## 🔄 Daily Workflow

After initial setup, to run the system daily:

```bash
# Terminal 1: Backend
cd opd-claim-adjudication/backend
npm start

# Terminal 2: Frontend (after backend is running)
cd opd-claim-adjudication/frontend
npm run dev

# Then open: http://localhost:3000
```

---

## 🆘 Still Having Issues?

1. **Check logs**: Look for error messages in terminal output
2. **Verify .env**: Make sure all values are correct
3. **Restart**: Kill all terminals and start again
4. **Clear cache**: Delete `node_modules` and reinstall

```bash
# Reinstall backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend dependencies
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎓 Learn More

- **MongoDB Docs**: https://docs.mongodb.com/
- **OpenAI API**: https://platform.openai.com/docs/
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

---

**You're all set! 🎉**

Visit http://localhost:3000 and start adjudicating claims!
