@echo off
REM Universal launcher for Windows Command Prompt / PowerShell.
REM Usage: start.bat  (double-click, or run from cmd.exe)

cd /d "%~dp0"

if not exist "node_modules" (
  echo [Start] node_modules tidak ditemukan, menjalankan npm install...
  where npm >nul 2>nul
  if errorlevel 1 (
    echo [Start] npm tidak ditemukan! Install Node.js dulu dari https://nodejs.org
    exit /b 1
  )
  call npm install --no-audit --no-fund
)

node index.js
