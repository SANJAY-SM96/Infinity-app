# Backend Server Start Guide

## Error: ERR_CONNECTION_REFUSED

This means the **backend server is not running**. You need to start it before the frontend can connect.

## Quick Fix: Start the Backend Server

### Step 1: Open PowerShell Terminal
Open a new PowerShell terminal window.

### Step 2: Navigate to Backend Directory
```powershell
cd P:\clg_proj\Infinity-app\backend
```

### Step 3: Check/Create .env File
```powershell
# Check if .env exists
Test-Path .env
```

If it doesn't exist, create one:
```powershell
# Copy the example file
Copy-Item .env.example .env
```

Or create manually with minimum required variables:
```env
MONGO_URI=mongodb://localhost:27017/infinity-app
JWT_SECRET=your_secret_key_here_12345
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 4: Install Dependencies (if needed)
```powershell
npm install
```

### Step 5: Start the Backend Server
```powershell
npm run dev
```

You should see:
```
✅ Server running on port 5000 in development mode
✅ MongoDB Connected: ...
📊 Rate limiting: DISABLED
```

### Step 6: Verify Backend is Running
1. Open browser: `http://localhost:5000/health`
2. You should see: `{"status":"Server is running","timestamp":"..."}`
3. Try logging in from frontend - error should be gone!

## Using the Start Script

### Option 1: Start Backend Only
```powershell
.\start-backend.ps1
```

### Option 2: Start Both Servers
```powershell
.\start-dev.ps1
```

This will start both backend and frontend in separate windows.

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```powershell
   # Windows
   net start MongoDB
   ```
3. Use connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017/infinity-app
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use in `.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/infinity-app?retryWrites=true&w=majority
   ```

## Troubleshooting

### MongoDB Connection Error
If you see `❌ Error connecting to MongoDB`:
- Make sure MongoDB is running
- Check `MONGO_URI` in `backend/.env`
- For local: `mongodb://localhost:27017/infinity-app`
- For Atlas: Use your connection string

### Port Already in Use
If port 5000 is already in use:
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` to match
- Restart both servers

### Missing Dependencies
```powershell
cd backend
npm install
```

## Verify Everything Works

1. ✅ Backend server running on port 5000
2. ✅ Health check works: `http://localhost:5000/health`
3. ✅ MongoDB connected
4. ✅ Frontend can connect to backend
5. ✅ Login works without connection errors

## Next Steps

Once backend is running:
- Try logging in from frontend
- Check backend terminal for API requests
- Test other features
- Check browser console for any errors

