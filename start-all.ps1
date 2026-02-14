# TensorTrade Full Stack Startup Script
# This script starts both backend and frontend servers simultaneously

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TENSORTRADE FULL STACK STARTUP       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "[ERROR] .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and add your API keys" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "[INFO] Starting backend and frontend servers..." -ForegroundColor Yellow
Write-Host ""

# Get current directory
$currentDir = Get-Location

# Start backend in a new window
Write-Host "[OK] Starting Backend Server..." -ForegroundColor Green
$backendCommand = "Set-Location '$currentDir'; if (Test-Path 'venv\Scripts\Activate.ps1') { .\venv\Scripts\Activate.ps1 }; Write-Host '[BACKEND] Running on http://localhost:8000' -ForegroundColor Green; uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

# Wait a few seconds for backend to start
Start-Sleep -Seconds 3

# Start frontend in a new window
Write-Host "[OK] Starting Frontend Server..." -ForegroundColor Green
$frontendCommand = "Set-Location '$currentDir\frontend-next'; Write-Host '[FRONTEND] Running on http://localhost:3000' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVERS STARTED SUCCESSFULLY!         " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Close the PowerShell windows to stop the servers" -ForegroundColor Yellow
Write-Host ""
