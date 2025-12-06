# Testing Your Backend

This guide shows you how to verify your backend is working correctly.

## 🚀 Quick Test (Fastest Way)

### Option 1: Run Demo Mode
```bash
cd backend
python main.py --demo
```

This will run through example messages and show you the results. You should see:
- ✅ GREEN classifications for safe messages
- ⚠️ YELLOW classifications for dismissive messages  
- 🚫 RED classifications for harmful messages
- Feedback messages for YELLOW and RED

### Option 2: Interactive Mode
```bash
cd backend
python main.py
```

Then type messages to test:
- `Hello, how are you?` → Should be GREEN
- `This is boring` → Should be YELLOW
- `You're stupid` → Should be RED
- `status` → Check system status
- `quit` → Exit

## 🧪 Run Automated Tests

### Run All Tests
```bash
cd backend
python -m pytest tests/ -v
```

### Run Specific Test Suites
```bash
# Test classification
python -m pytest tests/test_classification.py -v

# Test API endpoints
python -m pytest tests/test_api.py -v

# Test feedback generation
python -m pytest tests/test_feedback.py -v

# Test production pipeline
python -m pytest tests/test_production.py -v
```

### Run Tests with Coverage
```bash
python -m pytest tests/ --cov=src --cov-report=term-missing
```

## 🌐 Test the API Server

### 1. Start the API Server
```bash
cd backend
python main.py --api
```

The server will start on `http://localhost:8000`

### 2. Test with curl (in another terminal)

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Analyze a Message:**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"You're stupid\", \"age_range\": \"8-10\"}"
```

**Quick Classify:**
```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"fuck you\"}"
```

**Get Examples:**
```bash
curl http://localhost:8000/examples
```

### 3. Use the Interactive API Docs
Open in browser: `http://localhost:8000/docs`

This provides a Swagger UI where you can test all endpoints interactively.

## ✅ What to Check

### 1. System Status
In interactive mode, type `status` to see:
- ✅ Models loaded (should be True if models are available)
- ✅ Feedback mode (should be "hf_llm")
- ✅ HF LLM availability (✅ if API key is set, ❌ if using templates)
- ✅ Cache status

### 2. Expected Behaviors

**GREEN Messages** (should return no feedback):
- "Hello, how are you?"
- "Can we try again?"
- "I don't like this game"

**YELLOW Messages** (should return feedback):
- "This is boring"
- "Whatever"
- "I don't care"

**RED Messages** (should return feedback):
- "You're stupid"
- "fuck you"
- "go die"

### 3. Check for Errors

Look for:
- ❌ Import errors
- ❌ Missing dependencies
- ❌ Model loading failures (will fall back to rules)
- ❌ HF API errors (will fall back to templates)

## 🔧 Troubleshooting

### If tests fail:

1. **Check dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Check environment variables:**
   ```bash
   # Create .env file if missing
   echo "HF_API_KEY=your_key_here" > .env
   ```

3. **Run with verbose output:**
   ```bash
   python -m pytest tests/ -v -s
   ```

4. **Test without models (faster):**
   Tests use `use_models=False` by default, so they should work even without ML models.

### If API server won't start:

1. **Check if port 8000 is in use:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Linux/Mac
   lsof -i :8000
   ```

2. **Try a different port:**
   ```bash
   # Set environment variable
   export API_PORT=8001
   python main.py --api
   ```

## 📊 Test Checklist

- [ ] Demo mode runs without errors
- [ ] Interactive mode accepts input
- [ ] Tests pass (at least 80% should pass)
- [ ] API server starts successfully
- [ ] Health endpoint returns 200
- [ ] Analyze endpoint processes messages
- [ ] Classify endpoint returns classifications
- [ ] System status shows correct configuration
- [ ] Cache is working (check cache stats)

## 🎯 Quick Health Check Script

Save this as `test_backend.py`:

```python
#!/usr/bin/env python3
"""Quick health check for backend."""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.pipeline import MessageProcessor
from src.models import Classification

def test_backend():
    print("🔍 Testing backend...")
    
    # Initialize processor
    try:
        processor = MessageProcessor(use_models=False, feedback_mode="hf_llm")
        print("✅ Processor initialized")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")
        return False
    
    # Test messages
    test_cases = [
        ("Hello!", Classification.GREEN),
        ("This is boring", Classification.YELLOW),
        ("You're stupid", Classification.RED),
    ]
    
    for message, expected in test_cases:
        try:
            result = processor.process(message)
            if result.classification == expected:
                print(f"✅ '{message}' → {result.classification.value}")
            else:
                print(f"⚠️  '{message}' → {result.classification.value} (expected {expected.value})")
        except Exception as e:
            print(f"❌ Error processing '{message}': {e}")
            return False
    
    # Check status
    try:
        status = processor.get_system_status()
        print(f"✅ System status: {status['ready']}")
    except Exception as e:
        print(f"❌ Status check failed: {e}")
        return False
    
    print("\n✅ All tests passed!")
    return True

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)
```

Run it:
```bash
python test_backend.py
```

