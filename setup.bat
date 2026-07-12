@echo off
REM Windows Command Prompt equivalent of setup.sh

cd /d "%~dp0"

echo ============================================
echo            MINO BOT - by KevSoft-ID
echo ============================================
echo.

echo [1/2] Menginstall dependencies...
where npm >nul 2>nul
if errorlevel 1 (
  echo   x npm tidak ditemukan! Install Node.js dulu: https://nodejs.org
  exit /b 1
)
call npm install
echo   OK - Dependencies berhasil diinstall!

echo [2/2] Menyiapkan folder...
call node scripts\ensure-dirs.js

echo.
echo ============================================
echo   setup success
echo ============================================
echo.
echo Langkah selanjutnya:
echo   1. Edit set\settings.js - isi nomor bot ^& nomor owner kamu
echo   2. Jalankan: npm start   (atau: start.bat)
echo   3. Masukkan Pairing Code di WhatsApp
echo   4. Kirim .menu untuk mulai!
echo.
