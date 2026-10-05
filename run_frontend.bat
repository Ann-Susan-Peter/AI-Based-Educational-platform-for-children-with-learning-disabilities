@echo off
title AI Project - Frontend App
echo ===========================================
echo   Starting AI Project Frontend (React/Vite)
echo ===========================================
cd /d "%~dp0Frontend"
echo Installing/Verifying Node dependencies...
call npm install
echo.
echo Launching Vite Dev Server on http://localhost:5173 ...
call npm run dev
pause
