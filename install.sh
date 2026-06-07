#!/bin/bash

# Classroom Behavior Detection - Installation Script

echo ""
echo "=== Classroom Behavior Detection - Setup ==="
echo ""

# Check Python
if ! command -v python &> /dev/null; then
    echo "ERROR: Python not found. Please install Python 3.10+"
    exit 1
fi

echo "Installing dependencies..."
echo ""

# Upgrade pip
python -m pip install --upgrade pip

# Install core dependencies
python -m pip install fastapi uvicorn pillow python-multipart pydantic numpy

echo ""
echo "Attempting to install TensorFlow..."
echo "(This may take a few minutes on first install)"
echo ""

python -m pip install tensorflow

if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: TensorFlow installation failed"
    echo "Try one of these alternatives:"
    echo ""
    echo "For Python 3.11 or earlier:"
    echo "  python -m pip install tensorflow==2.14.0"
    echo ""
    echo "For Python 3.12:"
    echo "  python -m pip install tensorflow==2.21.0"
    echo ""
    echo "For minimal setup without ML inference:"
    echo "  The app will still run, but model predictions will not work"
    echo ""
fi

echo ""
echo "✓ Installation complete!"
echo ""
echo "To run the app:"
echo "  python main.py"
echo ""
echo "Then open: http://localhost:8000"
echo ""
