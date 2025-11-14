# 🚀 How to Run the Project

## Quick Start

### Option 1: Using PowerShell (Windows)

1. **Open PowerShell in the project root:**
   ```powershell
   cd P:\clg_proj\Infinity-app
   ```

2. **Start Backend Server:**
   ```powershell
   cd backend
   npm run dev
   ```
   - Backend will run on: `http://localhost:5000`

3. **Open a new PowerShell window and start Frontend Server:**
   ```powershell
   cd P:\clg_proj\Infinity-app\frontend
   npm run dev
   ```
   - Frontend will run on: `http://localhost:5173`

### Option 2: Using Command Prompt (Windows)

1. **Start Backend:**
   ```cmd
   cd backend
   npm run dev
   ```

2. **Start Frontend (in a new window):**
   ```cmd
   cd frontend
   npm run dev
   ```

### Option 3: Manual Start Script

Run this in PowerShell from the project root:

```powershell
# Start Backend
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd P:\clg_proj\Infinity-app\backend; npm run dev'

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd P:\clg_proj\Infinity-app\frontend; npm run dev'
```

## Server URLs

- **Backend API:** http://localhost:5000
- **Frontend App:** http://localhost:5173
- **Backend API Docs:** http://localhost:5000/api

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running on localhost:27017)
3. **npm** (comes with Node.js)

## Check if Servers are Running

### Backend
- Visit: http://localhost:5000/api/ai/availability
- Should return: `{"success":true,"available":true,"provider":"gemini"}`

### Frontend
- Visit: http://localhost:5173
- Should see the Infinity App homepage

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

**Backend:**
- Change `PORT` in `backend/.env`
- Default: `PORT=5000`

**Frontend:**
- Vite will automatically use the next available port
- Or change in `frontend/vite.config.js`

### MongoDB Not Connected

1. **Start MongoDB:**
   ```powershell
   # If MongoDB is installed as a service
   net start MongoDB
   
   # Or start MongoDB manually
   mongod
   ```

2. **Check MongoDB URI in `backend/.env`:**
   ```
   MONGO_URI=mongodb://localhost:27017/infinity-app
   ```

### Dependencies Not Installed

```powershell
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Environment Variables Missing

**Backend `.env` file should have:**
```
GEMINI_API_KEY=AIzaSyASIkxUfn2AJRvSABt-ulQVTW7IesrIJio
AI_PROVIDER=gemini
MONGO_URI=mongodb://localhost:27017/infinity-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend `.env` file should have:**
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_placeholder
VITE_RAZORPAY_KEY=rzp_test_placeholder
```

## Features Available

Once servers are running:

✅ **Homepage** - Modern landing page with animations
✅ **Product Catalog** - Browse digital products
✅ **AI Chatbot** - Interactive AI assistant
✅ **Build My Project** - Submit project requests
✅ **Multi-Currency Checkout** - USD/INR payments
✅ **Admin Dashboard** - Manage products and orders

## Next Steps

1. ✅ Start Backend Server
2. ✅ Start Frontend Server
3. ✅ Open http://localhost:5173 in browser
4. ✅ Test AI Chatbot (bottom-right corner)
5. ✅ Test "Build My Project" feature
6. ✅ Browse products and test checkout

## Stop Servers

- Press `Ctrl + C` in each terminal window
- Or close the PowerShell/Command Prompt windows

## Need Help?

- Check backend logs for errors
- Check frontend console for errors
- Verify MongoDB is running
- Verify environment variables are set
- Check if ports are available

