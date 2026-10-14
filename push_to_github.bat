@echo off
title Push EduSphere School to GitHub
echo ========================================================
echo   Pushing School Project to GitHub (medilinkdesk/School)
echo ========================================================
echo.

cd /d "%~dp0"

echo Current Status:
"C:\Program Files\Git\cmd\git.exe" status

echo.
echo Pushing to GitHub (main branch)...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS! Pushed to https://github.com/medilinkdesk/School
    echo ========================================================
    echo.
    echo Your GitHub Pages workflow is now deploying automatically!
    echo Check progress at: https://github.com/medilinkdesk/School/actions
    echo.
) else (
    echo.
    echo [NOTE] If you were prompted for credentials, sign in to your GitHub account or use a Personal Access Token.
    echo.
)

pause
