# Fix: ERR_CONNECTION_REFUSED Error

## Problem
You're getting `POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED`

This means the **backend server is not running**.

## Solution: Start the Backend Server

### Option 1: Use the Start Script (Easiest)

Run this command in PowerShell from the project root:
```powershell
.\start-backend.ps1
```

This will:
1. Check if `.env` file exists (create one if not)
2. Install dependencies if needed
3. Start the backend server on port 5000

### Option 2: Manual Start

1. **Open a new PowerShell terminal**
2. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

3. **Check if .env file exists:**
   ```powershell
   Test-Path .env
   ```
   
   If it doesn't exist, create one with:
   ```env
   MONGO_URI=mongodb://localhost:27017/infinity-app
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Install dependencies (if not already installed):**
   ```powershell
   npm install
   ```

5. **Start the backend server:**
   ```powershell
   npm run dev
   ```

6. **Verify it's running:**
   - You should see: `✅ Server running on port 5000`
   - Open browser: `http://localhost:5000/health`
   - Should see: `{"status":"Server is running","timestamp":"..."}`

### Option 3: Use the Development Script

Run from project root:
```powershell
.\start-dev.ps1
```

This starts both backend and frontend servers in separate windows.

## Verify Backend is Running

1. **Check the terminal output:**
   ```
   ✅ Server running on port 5000 in development mode
   ✅ MongoDB Connected: ...
   📊 Rate limiting: DISABLED
   ```

2. **Test the health endpoint:**
   - Open browser: `http://localhost:5000/health`
   - Should return: `{"status":"Server is running","timestamp":"..."}`

3. **Check if port 5000 is listening:**
   ```powershell
   netstat -ano | findstr :5000
   ```

## Common Issues

### 1. MongoDB Connection Error
If you see `❌ Error connecting to MongoDB`:
- Make sure MongoDB is running
- Check your `MONGO_URI` in `backend/.env`
- For local MongoDB: `mongodb://localhost:27017/infinity-app`
- For MongoDB Atlas: Use your connection string

### 2. Port Already in Use
If port 5000 is already in use:
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` to match
- Restart both servers

### 3. Missing Dependencies
If you get module not found errors:
```powershell
cd backend
npm install
```

### 4. Environment Variables Not Loaded
Make sure `.env` file exists in `backend/` directory with:
```env
MONGO_URI=mongodb://localhost:27017/infinity-app
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## After Starting Backend

1. ✅ Backend server should be running on `http://localhost:5000`
2. ✅ Frontend should now be able to connect
3. ✅ Try logging in again - the error should be gone
4. ✅ Check browser console - no more connection errors

## Quick Test

1. Start backend server
2. Open browser: `http://localhost:5000/health`
3. Should see: `{"status":"Server is running","timestamp":"..."}`
4. Try logging in from frontend
5. Check backend terminal for API requests

## Next Steps

Once backend is running:
- Try logging in from the frontend
- Check backend terminal for API logs
- Test other API endpoints
- Check browser console for any other errors

