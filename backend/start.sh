#!/bin/bash
# Startup script for Kid Message Safety API
# This ensures the server starts correctly

set -e

echo "============================================================"
echo "Kid Message Safety API - Startup Script"
echo "============================================================"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 not found. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py not found. Please run this script from the backend directory."
    exit 1
fi

# Check if requirements are installed
echo "📦 Checking dependencies..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "⚠️  Dependencies not installed. Installing now..."
    python3 -m pip install -r requirements.txt
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting API server..."
echo "   Server will be available at: http://localhost:8000"
echo "   API docs will be at: http://localhost:8000/docs"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the API server
python3 main.py --api

