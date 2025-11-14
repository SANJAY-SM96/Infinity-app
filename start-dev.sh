#!/bin/bash
# INFINITY App - Development Server Starter Script (Linux/Mac)
# This script starts both backend and frontend servers

echo "🚀 Starting INFINITY App Development Servers..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

echo "📦 Checking dependencies..."

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not found. Installing..."
    cd backend
    npm install
    cd ..
fi

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not found. Installing..."
    cd frontend
    npm install
    cd ..
fi

echo "✅ Dependencies checked"
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "   Please create backend/.env file with the following variables:"
    echo "   - MONGO_URI"
    echo "   - JWT_SECRET"
    echo "   - PORT (optional, defaults to 5000)"
    echo ""
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found!"
    echo "   Please create frontend/.env file with:"
    echo "   - VITE_API_URL=http://localhost:5000/api"
    echo ""
fi

echo "🔧 Starting servers..."
echo ""

# Start backend server
echo "📡 Starting backend server on http://localhost:5000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers are starting!"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "⏳ Please wait a few seconds for servers to fully start..."
echo ""
echo "💡 Tips:"
echo "   - Press Ctrl+C to stop both servers"
echo "   - Check the terminal output for any errors"
echo ""
echo "🔐 To create an admin user, run:"
echo "   cd backend"
echo "   npm run create-admin"
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait

