# Start Backend and Frontend Servers
Write-Host "🚀 Starting INFINITY App Servers..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "📡 Starting Backend Server on http://localhost:5000..." -ForegroundColor Yellow
$backendScript = @"
cd '$PSScriptRoot\backend'
Write-Host '📡 Backend Server Starting...' -ForegroundColor Cyan
npm run dev
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "🌐 Starting Frontend Server on http://localhost:5173..." -ForegroundColor Yellow
$frontendScript = @"
cd '$PSScriptRoot\frontend'
Write-Host '🌐 Frontend Server Starting...' -ForegroundColor Cyan
npm run dev
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host ""
Write-Host "✅ Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait a few seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Check the PowerShell windows that opened for server status" -ForegroundColor White
Write-Host ""

