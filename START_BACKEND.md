# How to Start the Backend Server

## Error: ERR_CONNECTION_REFUSED

This error means the backend server is not running. The frontend is trying to connect to `http://localhost:5000/api` but there's no server listening on that port.

## Solution: Start the Backend Server

### Step 1: Navigate to Backend Directory
```powershell
cd backend
```

### Step 2: Check Environment Variables
Make sure `backend/.env` file exists and has:
```env
MONGO_URI=mongodb://localhost:27017/infinity-app
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 3: Install Dependencies (if not already installed)
```powershell
npm install
```

### Step 4: Start the Backend Server
```powershell
npm run dev
```

You should see:
```
✅ Server running on port 5000 in development mode
✅ MongoDB Connected: ...
📊 Rate limiting: DISABLED
```

### Step 5: Verify Backend is Running
Open your browser and go to: `http://localhost:5000/health`

You should see:
```json
{"status":"Server is running","timestamp":"..."}
```

## Quick Start Script

Alternatively, you can use the provided PowerShell script to start both servers:

```powershell
.\start-dev.ps1
```

This will:
1. Check dependencies
2. Start backend server in one terminal
3. Start frontend server in another terminal

## Troubleshooting

### MongoDB Connection Error
If you see `❌ Error connecting to MongoDB`:
1. Make sure MongoDB is running
2. Check your `MONGO_URI` in `backend/.env`
3. For local MongoDB: `mongodb://localhost:27017/infinity-app`
4. For MongoDB Atlas: Use your connection string

### Port Already in Use
If port 5000 is already in use:
1. Change `PORT` in `backend/.env` to another port (e.g., 5001)
2. Update `VITE_API_URL` in `frontend/.env` to match
3. Restart both servers

### Missing Dependencies
If you get module not found errors:
```powershell
cd backend
npm install
```

## Verify Everything is Working

1. ✅ Backend server is running on `http://localhost:5000`
2. ✅ Backend health check works: `http://localhost:5000/health`
3. ✅ Frontend can connect to backend
4. ✅ Login works without connection errors

## Next Steps

Once the backend is running:
1. Try logging in from the frontend
2. Check the backend terminal for any errors
3. Check the browser console for any errors
4. Test API endpoints using the browser or Postman

