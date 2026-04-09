#!/bin/bash

# =============================================================
# ClientLoop - Quick Start Script for Mac/Linux
# =============================================================

echo ""
echo "==================================="
echo "  🚀 ClientLoop Quick Start"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node -v)"
echo "✓ npm found: $(npm -v)"
echo ""

# Check if MongoDB is running
if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null ; then
    echo "✓ MongoDB is running on localhost:27017"
else
    echo "⚠️  MongoDB not found on localhost:27017"
    echo "Please ensure MongoDB is running or update MONGODB_URI in server/.env"
    echo "For local MongoDB: brew services start mongodb-community"
    echo "For help, see SETUP_AND_LOGIN.md"
    echo ""
fi

# Navigate to server directory
cd server

# Install server dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install server dependencies"
        exit 1
    fi
fi
echo "✓ Server dependencies ready"
echo ""

# Offer to seed database
read -p "Do you want to seed demo data? (y/n) " -n 1 -r SEED
echo
if [[ $SEED =~ ^[Yy]$ ]]; then
    echo "Seeding demo data..."
    npm run seed
    if [ $? -ne 0 ]; then
        echo "⚠️  Seeding failed. Check MongoDB connection."
    fi
    echo ""
fi

# Go back to root
cd ..

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
fi
echo "✓ Frontend dependencies ready"
echo ""

echo "==================================="
echo "   📋 Starting ClientLoop"
echo "==================================="
echo ""
echo "✓ Backend will start on http://localhost:5000"
echo "✓ Frontend will start on http://localhost:3000"
echo ""
echo "When both are ready:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Login with: demo@agency.com / Demo@123456"
echo "  3. Or client login: client@demo.com / Demo@123456"
echo ""

# Start backend in background
echo "Starting Backend (Express.js on port 5000)..."
cd server
npm run dev > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

# Start frontend in background
echo "Starting Frontend (React + Vite on port 3000)..."
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!

sleep 2

echo ""
echo "✅ Both servers started!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running and handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Stopped servers'; exit 0" SIGINT

wait
