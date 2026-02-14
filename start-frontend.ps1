# TensorTrade Frontend Startup Script
# This script starts the Next.js frontend development server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TENSORTRADE FRONTEND SERVER STARTUP  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "frontend-next"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "[✓] Dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Starting Next.js Dev Server on port 3000  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
