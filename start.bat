@echo off
echo Starting AgroPulse AI Assistant...

REM Check if virtual environment exists
if not exist venv (
    echo Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if .env exists and OPENAI_API_KEY is set
if not exist .env (
    echo .env file not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

findstr /C:"OPENAI_API_KEY=your_openai_api_key_here" .env >nul
if %errorlevel% equ 0 (
    echo Please update the OPENAI_API_KEY in the .env file
    pause
    exit /b 1
)

REM Start the FastAPI server
echo Starting server...
start "AgroPulse AI Backend" cmd /k "python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak

REM Open the application in default browser
echo Opening application in browser...
start http://localhost:8000

echo AgroPulse AI Assistant is running!
echo Press Ctrl+C in the server window to stop the application
echo.
echo Access the application at: http://localhost:8000
echo API documentation at: http://localhost:8000/docs
pause
