#!/bin/bash
# Firebase Deployment Script for Linux/Mac
# This script builds the frontend and deploys it to Firebase Hosting

echo "🚀 Starting Firebase Deployment..."

# Check if Firebase CLI is installed
echo "📦 Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

FIREBASE_VERSION=$(firebase --version)
echo "✅ Firebase CLI found: $FIREBASE_VERSION"

# Navigate to frontend directory
echo ""
echo "📁 Building frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    cd ..
    exit 1
fi

echo "✅ Build completed successfully!"

# Navigate back to root
cd ..

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Please run 'firebase init hosting' first."
    exit 1
fi

# Deploy to Firebase
echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live on Firebase!"
else
    echo ""
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi

