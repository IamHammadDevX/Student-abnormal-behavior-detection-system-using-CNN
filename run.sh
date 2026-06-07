#!/bin/bash
# Run FastAPI with Python 3.12 (has TensorFlow)

PYTHON312="/c/Users/hP/AppData/Local/Programs/Python/Python312/python.exe"

if [ -f "$PYTHON312" ]; then
    echo "Running with Python 3.12 (TensorFlow-enabled)"
    "$PYTHON312" main.py "$@"
else
    echo "Python 3.12 not found, using default python"
    python main.py "$@"
fi
