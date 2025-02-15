@echo off
echo Setting up AgroPulse AI Assistant...

REM Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed!
    echo Please install Python 3.7 or higher from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Create necessary directories
echo Creating directories...
mkdir static 2>nul
mkdir uploads 2>nul

REM Check if .env file exists, create if not
if not exist .env (
    echo Creating .env file...
    echo OPENAI_API_KEY=your_openai_api_key_here > .env
    echo Please update the OPENAI_API_KEY in the .env file
)

echo Setup complete! Run start.bat to start the application.
pause
