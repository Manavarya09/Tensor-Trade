# TensorTrade Backend Startup Script
# This script starts the FastAPI backend server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TENSORTRADE BACKEND SERVER STARTUP   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "[ERROR] .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and add your API keys" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Required API keys:" -ForegroundColor Yellow
    Write-Host "  - GROQ_API_KEY" -ForegroundColor Yellow
    Write-Host "  - OPENROUTER_API_KEY" -ForegroundColor Yellow
    Write-Host "  - MISTRAL_API_KEY" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "[✓] Found .env file" -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "[INFO] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "[✓] Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "[INFO] Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install/Update dependencies
Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Starting FastAPI Server on port 8000  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:8000" -ForegroundColor White
Write-Host "  http://localhost:8000/docs (API Documentation)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
