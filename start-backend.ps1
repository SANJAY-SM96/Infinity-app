# Start Backend Server Script
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot\backend

# Check if .env file exists
if (!(Test-Path .env)) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Creating .env file with default values..." -ForegroundColor Yellow
    Write-Host ""
    @"
MONGO_URI=mongodb://localhost:27017/infinity-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ Created .env file. Please update MONGO_URI and JWT_SECRET!" -ForegroundColor Yellow
    Write-Host ""
}

# Check if node_modules exists
if (!(Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the server
Write-Host "✅ Starting backend server on http://localhost:5000..." -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

