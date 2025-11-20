# INFINITY App - Development Server Starter Script
# This script starts both backend and frontend servers

Write-Host "Starting INFINITY App Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

# Check backend dependencies
if (!(Test-Path "backend\node_modules")) {
    Write-Host "⚠️  Backend dependencies not found. Installing..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Check frontend dependencies
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "⚠️  Frontend dependencies not found. Installing..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencies checked" -ForegroundColor Green
Write-Host ""

# Check if .env files exist
if (!(Test-Path "backend\.env")) {
    Write-Host "⚠️  Backend .env file not found!" -ForegroundColor Yellow
    Write-Host "   Please create backend\.env file with the following variables:" -ForegroundColor Yellow
    Write-Host "   - MONGO_URI" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET" -ForegroundColor Yellow
    Write-Host "   - PORT (optional, defaults to 5000)" -ForegroundColor Yellow
    Write-Host ""
}

if (!(Test-Path "frontend\.env")) {
    Write-Host "⚠️  Frontend .env file not found!" -ForegroundColor Yellow
    Write-Host "   Please create frontend\.env file with:" -ForegroundColor Yellow
    Write-Host "   - VITE_API_URL=http://localhost:5000/api" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "🔧 Starting servers..." -ForegroundColor Cyan
Write-Host ""

# Start backend server
Write-Host "📡 Starting backend server on http://localhost:5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🌐 Starting frontend server on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait a few seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Tips:" -ForegroundColor Yellow
Write-Host "   - Backend will run in a new PowerShell window" -ForegroundColor White
Write-Host "   - Frontend will run in a new PowerShell window" -ForegroundColor White
Write-Host "   - Close those windows to stop the servers" -ForegroundColor White
Write-Host "   - Check the terminal output for any errors" -ForegroundColor White
Write-Host ""
Write-Host "🔐 To create an admin user, run:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run create-admin" -ForegroundColor White
Write-Host ""

