@echo off
title EduSphere Pro - School Management System
echo ========================================================
echo   Starting EduSphere Pro - School Management & ID Studio
echo ========================================================
echo.
cd /d "%~dp0"

echo Opening browser at http://localhost:3000/ ...
start "" http://localhost:3000/

echo Starting server...
npm run dev
pause
