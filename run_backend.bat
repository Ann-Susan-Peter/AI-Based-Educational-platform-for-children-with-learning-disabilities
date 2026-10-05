@echo off
title AI Project - Backend Server
echo ===========================================
echo   Starting AI Project Backend (Flask API)
echo ===========================================
cd /d "%~dp0Backend"
echo Installing/Verifying Python dependencies...
python -m pip install -r requirements.txt
echo.
echo Launching Flask Server on http://127.0.0.1:5000 ...
python app.py
pause
