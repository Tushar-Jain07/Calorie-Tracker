@echo off
echo.
echo ================================
echo   MacroSnap Setup Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node -v
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Installation failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Installation complete!
echo.
echo Available commands:
echo   npm run dev      - Start development server
echo   npm run build    - Build for production
echo   npm run preview  - Preview production build
echo.
echo To get started:
echo   npm run dev
echo.
echo For deployment instructions, see DEPLOYMENT.md
echo.
echo Demo account: username=demo, password=demo
echo.
echo Enjoy MacroSnap!
echo.
pause
