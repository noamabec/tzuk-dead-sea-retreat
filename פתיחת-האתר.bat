@echo off
cd /d "%~dp0"
start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Minimized -File "%~dp0serve.ps1" -Root "%~dp0." -Port 8821
timeout /t 2 /nobreak >nul
start "" http://localhost:8821/index.html
