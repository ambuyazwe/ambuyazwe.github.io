@echo off
echo ============================================
echo   Portfolio Setup
echo ============================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git is not installed. Opening download page...
    start https://git-scm.com/download/win
    echo     Install it, keep all defaults, then re-run this script.
    echo.
    pause
    exit /b 1
)
echo [OK] Git found

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js is not installed. Opening download page...
    start https://nodejs.org/
    echo     Pick the LTS version, install it, then re-run this script.
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [!] npm install failed.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Setup complete!
echo   Double-click preview.bat to start previewing.
echo ============================================
pause
