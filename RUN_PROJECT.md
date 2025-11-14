# 🚀 How to Run the INFINITY Project

## Quick Start (Windows PowerShell)

### Option 1: Use the Start Script (Recommended)
```powershell
# Run the start script
.\start-dev.ps1
```

This will:
- Check dependencies
- Start backend server (port 5000)
- Start frontend server (port 3000)
- Open in separate windows

### Option 2: Manual Start (Two Terminals)

#### Terminal 1 - Backend
```powershell
cd p:\clg_proj\Infinity-app\backend
npm run dev
```

#### Terminal 2 - Frontend
```powershell
cd p:\clg_proj\Infinity-app\frontend
npm run dev
```

## Server URLs

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000
- **Backend Health Check**: http://localhost:5000/health

## Prerequisites

1. **Node.js** (v18 or higher)
   ```powershell
   node --version
   ```

2. **MongoDB Atlas** connection
   - Make sure `backend/.env` has `MONGO_URI` set
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

3. **Environment Variables**
   - Backend `.env` should have:
     - `MONGO_URI` - MongoDB connection string
     - `JWT_SECRET` - Secret key for JWT tokens
     - `PORT` - Backend port (default: 5000)
     - `CLIENT_URL` - Frontend URL (default: http://localhost:3000)
   
   - Frontend `.env` should have:
     - `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## First Time Setup

### 1. Install Dependencies
```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables
```powershell
# Backend - Copy example file
cd backend
Copy-Item .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend - Copy example file
cd ../frontend
Copy-Item .env.example .env
# Edit .env with your API URL (if needed)
```

### 3. Create Admin User
```powershell
cd backend
npm run create-admin
```

### 4. Start Servers
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## Verify Installation

### Check Backend
```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/health"
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2025-..."
}
```

### Check Frontend
- Open browser: http://localhost:3000
- You should see the INFINITY homepage

## Common Issues

### Backend won't start
- **MongoDB connection error**: Check `MONGO_URI` in `.env`
- **Port already in use**: Change `PORT` in `.env` or kill process using port 5000
- **Missing dependencies**: Run `npm install` in backend folder

### Frontend won't start
- **Port already in use**: Kill process using port 3000 or change port in `vite.config.js`
- **Missing dependencies**: Run `npm install` in frontend folder
- **API connection error**: Check `VITE_API_URL` in frontend `.env`

### CORS errors
- Make sure `CLIENT_URL` in backend `.env` matches frontend URL
- Check that backend is running before frontend

### Can't access admin page
- Create admin user: `cd backend && npm run create-admin`
- Login with admin credentials
- See `ADMIN_ACCESS.md` for details

## Stop Servers

### If using start script
- Close the PowerShell windows opened by the script

### If running manually
- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

## Development Workflow

1. **Start backend** (Terminal 1)
   ```powershell
   cd backend
   npm run dev
   ```

2. **Start frontend** (Terminal 2)
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Make changes** - Both servers auto-reload on file changes

4. **Test changes** - Visit http://localhost:3000

5. **Check logs** - Watch terminal output for errors

## Production Build

### Build Frontend
```powershell
cd frontend
npm run build
```

### Start Backend (Production)
```powershell
cd backend
npm start
```

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Clear Cache and Reinstall
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist includes your IP
- Check connection string format
- Verify database user credentials
- Test connection in MongoDB Compass

## Next Steps

1. ✅ Servers are running
2. ✅ Visit http://localhost:3000
3. ✅ Register a new user
4. ✅ Create admin user: `cd backend && npm run create-admin`
5. ✅ Login as admin
6. ✅ Access admin dashboard: http://localhost:3000/admin
7. ✅ Add products, manage orders, etc.

## Need Help?

- Check `README.md` for full documentation
- Check `QUICKSTART.md` for quick setup guide
- Check `ADMIN_ACCESS.md` for admin setup
- Check `DEPLOYMENT.md` for production deployment
- Check server logs in terminal for errors

---

**Happy Coding! 🚀**

