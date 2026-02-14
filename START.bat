@echo off
REM Quick Start Script for TensorTrade
REM This batch file can be double-clicked to start both servers

echo ========================================
echo   TENSORTRADE QUICK START
echo ========================================
echo.

REM Check if PowerShell is available
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PowerShell not found!
    echo Please install PowerShell to run this application.
    pause
    exit /b 1
)

REM Run the PowerShell startup script
powershell -ExecutionPolicy Bypass -File ".\start-all.ps1"

pause
