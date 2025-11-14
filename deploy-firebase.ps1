# Firebase Deployment Script for Windows PowerShell
# This script builds the frontend and deploys it to Firebase Hosting

Write-Host "🚀 Starting Firebase Deployment..." -ForegroundColor Cyan

# Check if Firebase CLI is installed
Write-Host "📦 Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Navigate to frontend directory
Write-Host "`n📁 Building frontend..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the project
Write-Host "🔨 Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Navigate back to root
Set-Location ..

# Check if firebase.json exists
if (-not (Test-Path "firebase.json")) {
    Write-Host "❌ firebase.json not found. Please run 'firebase init hosting' first." -ForegroundColor Red
    exit 1
}

# Deploy to Firebase
Write-Host "`n🚀 Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your app is now live on Firebase!" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment failed! Please check the errors above." -ForegroundColor Red
    exit 1
}

