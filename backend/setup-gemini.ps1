# Setup Gemini API Key Script
# This script updates or creates the .env file with Gemini API key

Write-Host "🔧 Setting up Gemini API Key..." -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
$geminiKey = "AIzaSyASIkxUfn2AJRvSABt-ulQVTW7IesrIJio"

# Check if .env exists
if (Test-Path $envFile) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    Write-Host "📝 Updating Gemini API key..." -ForegroundColor Yellow
    
    # Read existing .env content
    $content = Get-Content $envFile -Raw
    
    # Check if GEMINI_API_KEY already exists
    if ($content -match "GEMINI_API_KEY=") {
        # Replace existing key
        $content = $content -replace "GEMINI_API_KEY=.*", "GEMINI_API_KEY=$geminiKey"
        Write-Host "✅ Updated existing GEMINI_API_KEY" -ForegroundColor Green
    } else {
        # Add new key
        $content += "`nGEMINI_API_KEY=$geminiKey`n"
        Write-Host "✅ Added GEMINI_API_KEY" -ForegroundColor Green
    }
    
    # Check if AI_PROVIDER exists
    if ($content -notmatch "AI_PROVIDER=") {
        $content += "AI_PROVIDER=gemini`n"
        Write-Host "✅ Added AI_PROVIDER=gemini" -ForegroundColor Green
    } else {
        # Update to gemini if it's not already set
        if ($content -notmatch "AI_PROVIDER=gemini") {
            $content = $content -replace "AI_PROVIDER=.*", "AI_PROVIDER=gemini"
            Write-Host "✅ Updated AI_PROVIDER to gemini" -ForegroundColor Green
        }
    }
    
    # Write back to file
    $content | Set-Content $envFile -NoNewline
} else {
    Write-Host "⚠️  .env file does not exist. Creating new one..." -ForegroundColor Yellow
    
    # Create new .env file with Gemini key
    @"
# AI Configuration
GEMINI_API_KEY=$geminiKey
AI_PROVIDER=gemini

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/infinity-app

# JWT Secret Key (Change this to a secure random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Payment Gateways (Optional - for payment features)
# STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
# STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_key_secret
# RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email Configuration (Optional)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_email_password

# Google OAuth (Optional)
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
"@ | Out-File -FilePath $envFile -Encoding utf8
    
    Write-Host "✅ Created .env file with Gemini API key" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Gemini API key configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure .env is in .gitignore to protect your API key!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Verifying configuration..." -ForegroundColor Cyan
$envContent = Get-Content $envFile
if ($envContent -match "GEMINI_API_KEY=") {
    Write-Host "✅ GEMINI_API_KEY is set" -ForegroundColor Green
}
if ($envContent -match "AI_PROVIDER=gemini") {
    Write-Host "✅ AI_PROVIDER is set to gemini" -ForegroundColor Green
}
Write-Host ""
Write-Host "🚀 You can now start the backend server to use AI features!" -ForegroundColor Cyan
Write-Host "   Run: npm run dev" -ForegroundColor White

