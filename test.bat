@echo off
echo Testing AgroPulse AI Assistant...

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Test Python and required packages
echo Testing Python installation...
python --version
if %errorlevel% neq 0 (
    echo Error: Python test failed!
    exit /b 1
)

echo Testing required packages...
python -c "import fastapi; import uvicorn; import openai; import PIL; print('All packages installed successfully!')"
if %errorlevel% neq 0 (
    echo Error: Package test failed!
    exit /b 1
)

REM Test OpenAI API key
echo Testing OpenAI API key...
python -c "import os; from dotenv import load_dotenv; load_dotenv(); key = os.getenv('OPENAI_API_KEY'); assert key and key != 'your_openai_api_key_here', 'Invalid API key'"
if %errorlevel% neq 0 (
    echo Error: OpenAI API key test failed!
    exit /b 1
)

echo All tests passed successfully!
pause
