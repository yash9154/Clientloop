@echo off
REM =============================================================
REM ClientLoop - Quick Start Script for Windows
REM =============================================================

echo.
echo ===================================
echo   🚀 ClientLoop Quick Start
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
echo.

REM Check if MongoDB is running
netstat -ano | findstr :27017 >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo ✓ MongoDB is running on localhost:27017
) else (
    echo ⚠️  MongoDB not found on localhost:27017
    echo Please ensure MongoDB is running or update MONGODB_URI in server/.env
    echo For help, see SETUP_AND_LOGIN.md
    echo.
)

REM Navigate to server directory and install dependencies
echo Installing server dependencies...
cd server
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install server dependencies
        pause
        exit /b 1
    )
)
echo ✓ Server dependencies ready
echo.

REM Offer to seed database
echo Do you want to seed demo data? (Y/N)
set /p SEED="Enter choice: "
if /i "%SEED%"=="Y" (
    echo Seeding demo data...
    call npm run seed
    if %ERRORLEVEL% neq 0 (
        echo ⚠️  Seeding failed. Check MongoDB connection.
    )
    echo.
)

REM Go back to root
cd ..

REM Install frontend dependencies if needed
echo Installing frontend dependencies...
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Frontend dependencies ready
echo.

echo ===================================
echo   📋 Starting ClientLoop
echo ===================================
echo.
echo ✓ Backend will start on http://localhost:5000
echo ✓ Frontend will start on http://localhost:3000
echo.
echo When both are ready:
echo   1. Open http://localhost:3000 in your browser
echo   2. Login with: demo@agency.com / Demo@123456
echo   3. Or client login: client@demo.com / Demo@123456
echo.

REM Start backend in new window
echo Starting Backend (Express.js on port 5000)...
start cmd /k "cd server && npm run dev"

timeout /t 3

REM Start frontend in new window
echo Starting Frontend (React + Vite on port 3000)...
start cmd /k "npm run dev"

echo.
echo ✅ Both servers started in new windows!
echo Close windows to stop servers.
echo.
pause
