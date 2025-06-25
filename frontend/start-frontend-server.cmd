@echo off
REM Simple static server for frontend using serve package

REM Check if serve is installed, if not install it globally
npm list -g serve >nul 2>&1
if %errorlevel% neq 0 (
  echo "Installing serve package globally..."
  npm install -g serve
)

REM Serve the frontend/public directory on port 3000
serve -s frontend/public -l 3000
