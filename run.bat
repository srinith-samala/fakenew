@echo off
title Fake News Detector Server
echo ========================================================
echo         Starting Fake News Detector Application         
echo ========================================================
echo.
echo Starting FastAPI / Uvicorn Server...
echo Press Ctrl+C in this window to stop the server.
echo.
start /b python app.py
echo Waiting for server to start...
timeout /t 3 /nobreak > nul
echo Launching Web Browser at http://127.0.0.1:8000...
start http://127.0.0.1:8000
echo.
echo Server is running. Press Ctrl+C to stop.
echo.
wait
pause
