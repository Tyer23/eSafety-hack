# 🚀 Backend Startup Guide

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
cd backend
./start.sh
```

### Option 2: Manual startup
```bash
cd backend

# Install dependencies (first time only)
python3 -m pip install -r requirements.txt

# Start the server
python3 main.py --api
```

## What the startup script does

1. ✅ Checks if Python 3 is installed
2. ✅ Verifies you're in the correct directory
3. ✅ Checks if dependencies are installed (installs them if missing)
4. ✅ Starts the API server on port 8000

## Server Information

- **API URL**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Health Check**: `http://localhost:8000/health`

## Troubleshooting

### "python3: command not found"
- Install Python 3.8 or higher
- On macOS: `brew install python3`
- On Linux: `sudo apt-get install python3`

### "Module not found" errors
- Run: `python3 -m pip install -r requirements.txt`

### Port 8000 already in use
- Change the port: `export API_PORT=8001 && python3 main.py --api`
- Or kill the process using port 8000

### Server starts but API calls fail
- Check the console for error messages
- Verify the server is running: `curl http://localhost:8000/health`
- Check browser console for CORS errors (should be handled by Next.js proxy)

## Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```bash
# Optional: Hugging Face API key for LLM feedback
HF_API_KEY=your_token_here

# Optional: Override default settings
API_PORT=8000
DEVICE=cpu
AGE_RANGE=8-10
```

**Note**: The system works without `HF_API_KEY` - it will use template-based feedback instead.

## Integration with Frontend

The frontend (Next.js) connects to the backend via:
- **Proxy route**: `/api/ml/analyze` (handles CORS automatically)
- **Backend URL**: Configured in `web/app/api/ml/analyze/route.ts`

The proxy forwards requests to `http://localhost:8000/analyze` server-side, avoiding CORS issues.

