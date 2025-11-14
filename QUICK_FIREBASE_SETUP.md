# Quick Firebase Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase (First Time Only)
```bash
firebase init hosting
```

**When prompted:**
- Select "Use an existing project" or "Create a new project"
- Public directory: `frontend/dist`
- Configure as single-page app: **Yes**
- Overwrite index.html: **No**

### Step 4: Update Project ID
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID from [Firebase Console](https://console.firebase.google.com/)

### Step 5: Set Production API URL (Optional)
Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Step 6: Deploy!

**Windows (PowerShell):**
```powershell
.\deploy-firebase.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy-firebase.sh
./deploy-firebase.sh
```

**Or manually:**
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## ✅ Done!

Your app will be live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## 📝 Notes

- **Backend**: Firebase Hosting only serves static files. Deploy your Node.js backend separately (Railway, Render, Heroku, etc.)
- **Environment Variables**: Use `.env.production` for production API URLs
- **CORS**: Make sure your backend allows requests from your Firebase domain

## 🔧 Troubleshooting

**Build fails?**
- Run `cd frontend && npm install` first
- Check for TypeScript/ESLint errors

**Deploy fails?**
- Make sure you're logged in: `firebase login`
- Check your project ID in `.firebaserc`
- Verify `firebase.json` exists

**API not working?**
- Update `VITE_API_URL` in `.env.production`
- Rebuild: `cd frontend && npm run build`
- Redeploy: `firebase deploy --only hosting`

