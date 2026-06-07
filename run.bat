@echo off
REM Run FastAPI with Python 3.12 (has TensorFlow)
setlocal enabledelayedexpansion

REM Try Python 3.12
set PYTHON312=C:\Users\hP\AppData\Local\Programs\Python\Python312\python.exe

if exist "%PYTHON312%" (
    echo Running with Python 3.12 (TensorFlow-enabled)
    "%PYTHON312%" main.py %*
    exit /b !errorlevel!
)

REM Fallback to default python
echo Python 3.12 not found, using default python
python main.py %*
