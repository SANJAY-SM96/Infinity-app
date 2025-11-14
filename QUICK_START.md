# Quick Start Guide - Fix Connection Refused Error

## Problem
You're getting `ERR_CONNECTION_REFUSED` when trying to connect to the backend API.

## Solution
The backend server needs to be running before the frontend can connect to it.


### Option 1: Using PowerShell Script (Recommended)
```powershell
.\start-dev.ps1
```
This will start both backend and frontend servers.

### Option 2: Manual Start

#### 1. Start Backend Server
```powershell
cd backend
npm run dev
```
The backend should start on `http://localhost:5000`

#### 2. Start Frontend Server (in a new terminal)
```powershell
cd frontend
npm run dev
```
The frontend should start on `http://localhost:5173` (or similar)

## Verify Backend is Running

1. Check if backend is running:
   - Open browser and go to: `http://localhost:5000/health`
   - You should see: `{"status":"Server is running","timestamp":"..."}`

2. Check backend terminal:
   - You should see: `✅ Server running on port 5000 in development mode`
   - You should see: `✅ MongoDB Connected: ...`

## Common Issues

### Backend Won't Start

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify `MONGO_URI` in `backend/.env` is correct
   - Format: `mongodb://localhost:27017/infinity-app` or your MongoDB Atlas connection string

2. **Port Already in Use**
   - Change `PORT` in `backend/.env` to a different port (e.g., 5001)
   - Update `VITE_API_URL` in `frontend/.env` to match

3. **Missing Dependencies**
   ```powershell
   cd backend
   npm install
   ```

### Frontend Can't Connect to Backend

1. **Check API URL**
   - Verify `VITE_API_URL` in `frontend/.env` is `http://localhost:5000/api`
   - Restart frontend dev server after changing `.env`

2. **CORS Issues**
   - Backend should allow `http://localhost:5173` (or your frontend URL)
   - Check `CLIENT_URL` in `backend/.env`

## Required Environment Variables

### Backend `.env`
```env
MONGO_URI=mongodb://localhost:27017/infinity-app
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing the Connection

1. Start backend server
2. Open browser console
3. Go to your frontend application
4. Try to login or make any API call
5. Check network tab - requests should go to `http://localhost:5000/api/...`

## Next Steps

Once backend is running:
1. Test the API endpoint: `http://localhost:5000/health`
2. Try logging in from the frontend
3. Check backend terminal for any errors
4. Check browser console for any errors

