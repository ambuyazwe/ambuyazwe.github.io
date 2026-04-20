@echo off
echo ============================================
echo   Starting local preview with auto-sync...
echo ============================================
echo.
echo   Pulling latest changes...
git pull
echo.
echo   Starting preview server and sync watcher...
echo   Preview at: http://localhost:4321
echo   Changes from the CMS will appear automatically.
echo   Press Ctrl+C to stop.
echo.

start /b node scripts/auto-pull.js
call npx astro dev
