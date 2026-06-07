@echo off
REM Classroom Behavior Detection - Installation Script
echo.
echo === Classroom Behavior Detection - Setup ===
echo.

REM Detect Python version
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.10+ and add to PATH
    pause
    exit /b 1
)

echo Installing dependencies...
echo.

REM Try installing with pip from requirements
python -m pip install --upgrade pip
echo.
python -m pip install fastapi uvicorn pillow python-multipart pydantic numpy
echo.

REM Try TensorFlow installation
echo Attempting to install TensorFlow...
echo (This may take a few minutes on first install)
echo.

python -m pip install tensorflow

if %errorlevel% neq 0 (
    echo.
    echo WARNING: TensorFlow installation failed
    echo Try one of these alternatives:
    echo.
    echo For Python 3.11 or earlier:
    echo   python -m pip install tensorflow==2.14.0
    echo.
    echo For Python 3.12:
    echo   python -m pip install tensorflow==2.21.0
    echo.
    echo For minimal setup without ML inference:
    echo   The app will still run, but model predictions will not work
    echo.
)

echo.
echo ✓ Installation complete!
echo.
echo To run the app:
echo   python main.py
echo.
echo Then open: http://localhost:8000
echo.
pause
