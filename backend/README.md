# KindNet ML Backend

> Python FastAPI backend providing AI-powered message analysis and feedback for children

Real-time text classification and educational feedback system using Hugging Face transformers and pattern-based analysis.

## 🚀 Quick Start

```bash
# Start the server (recommended)
cd backend
./start.sh

# Expected output:
# ✅ Started server on http://0.0.0.0:8000
# 📚 API docs: http://localhost:8000/docs
```

The server will be available at **http://localhost:8000**

## 📋 Prerequisites

- **Python** 3.8+
- **pip** (Python package manager)
- **Optional**: Hugging Face API key for better AI responses

## 🎨 What This Does

The backend analyzes children's messages and provides:

- **Three-tier classification**: 🟢 GREEN (safe), 🟡 YELLOW (caution), 🔴 RED (harmful)
- **Real-time feedback**: Age-appropriate guidance on improving language
- **Pattern detection**: Profanity, toxicity, bullying, threats, privacy risks
- **Emotion analysis**: Joy, anger, sadness, fear, surprise
- **Intent recognition**: Positive, negative, questions, sharing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   KindNet ML Backend                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FastAPI Server (Port 8000)                            │
│  ├── /analyze     - Full message analysis              │
│  ├── /classify    - Quick classification only          │
│  ├── /health      - Health check                       │
│  └── /docs        - Interactive API docs               │
│                                                         │
│  MessageProcessor (Core Pipeline)                      │
│  ├── Preprocessor      - Text cleaning                │
│  ├── Analyzers                                         │
│  │   ├── Toxicity      - Profanity, hate speech       │
│  │   ├── Patterns      - Threats, bullying, privacy   │
│  │   └── Emotion       - Emotional state              │
│  ├── Classifier        - GREEN/YELLOW/RED decision    │
│  ├── FeedbackGenerator - AI-powered responses         │
│  └── ResponseCache     - Performance optimization     │
│                                                         │
│  Hugging Face Integration (Optional)                  │
│  └── LLM for personalized feedback                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
backend/
├── main.py                    # Entry point (CLI, demo, API modes)
├── requirements.txt           # Python dependencies
├── start.sh                   # Quick start script
│
├── src/
│   ├── pipeline.py            # MessageProcessor (core)
│   ├── preprocessor.py        # Text cleaning
│   ├── models.py              # Data models & types
│   │
│   ├── analyzer/              # Analysis modules
│   │   ├── toxicity.py        # Profanity & hate detection
│   │   ├── patterns.py        # Threat, bullying patterns
│   │   └── emotion.py         # Emotion & intent analysis
│   │
│   ├── classifier/            # Classification logic
│   │   └── decision_engine.py # GREEN/YELLOW/RED rules
│   │
│   ├── feedback/              # Feedback generation
│   │   ├── generator.py       # Main feedback logic
│   │   ├── hf_llm_generator.py # Hugging Face LLM
│   │   └── templates.py       # Fallback templates
│   │
│   ├── api/                   # FastAPI application
│   │   └── app.py             # API routes & endpoints
│   │
│   └── utils/                 # Utilities
│       ├── config.py          # Configuration
│       └── logger.py          # Logging
│
├── tests/                     # Test suite
│   ├── test_classification.py
│   ├── test_pipeline.py
│   └── ...
│
├── examples/                  # Usage examples
│   ├── basic_usage.py         # Direct pipeline usage
│   └── api_demo.py            # API client example
│
└── docs/                      # Documentation
    ├── STARTUP.md             # Detailed startup guide
    ├── HUGGINGFACE_SETUP.md   # LLM integration setup
    ├── DATA_PIPELINE.md       # Pipeline architecture
    └── TESTING.md             # Testing guide
```

## 🔌 API Endpoints

### POST /analyze
Full analysis with classification and feedback.

**Request:**
```json
{
  "message": "You're so stupid",
  "age_range": "8-10"
}
```

**Response:**
```json
{
  "classification": "RED",
  "confidence": 0.95,
  "feedback": "Those words can hurt someone's feelings...",
  "analysis": {
    "toxicity": {
      "score": 0.87,
      "has_profanity": false,
      "severity": "high"
    },
    "detected_issues": ["personal_attack", "harsh_criticism"],
    "emotion": {
      "primary_emotion": "anger",
      "intensity": "high"
    },
    "intent": "negative"
  },
  "metadata": {
    "processing_time_ms": 234,
    "cached": false
  }
}
```

### POST /classify
Quick classification only (no feedback).

**Request:**
```json
{
  "message": "Hello friend!"
}
```

**Response:**
```json
{
  "classification": "GREEN",
  "confidence": 0.98
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

### Interactive Docs
Visit **http://localhost:8000/docs** when server is running for full API documentation with try-it-out functionality.

## 🎯 Classification Rules

| Level | Criteria | Example Messages |
|-------|----------|------------------|
| 🟢 **GREEN** | Safe, constructive, positive | "Hello!", "Can we try again?", "That's cool!" |
| 🟡 **YELLOW** | Dismissive, mild criticism, needs improvement | "Whatever", "This is boring", "You're annoying" |
| 🔴 **RED** | Profanity, threats, attacks, harmful content | "You're stupid", "I hate you", "Go die" |

## 🔧 Configuration

### Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Optional: Hugging Face API key for better AI responses
# Get free token: https://huggingface.co/settings/tokens
HF_API_KEY=your_token_here

# Optional: Override defaults
HF_MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2  # LLM model to use
API_PORT=8000                                    # Server port
DEVICE=cpu                                       # cpu or cuda
DEFAULT_AGE_RANGE=8-10                          # 8-10 or 11-13
```

**Note**: The system works without `HF_API_KEY` using template-based feedback.

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_classification.py -v

# With coverage
python -m pytest tests/ --cov=src

# Quick verification
python main.py --demo
```

See [docs/TESTING.md](docs/TESTING.md) for detailed testing guide.

## 💻 Usage Examples

### CLI Interactive Mode
```bash
python main.py
```

### Demo Mode
```bash
python main.py --demo
```

### API Server
```bash
python main.py --api
# or
./start.sh
```

### Python Integration
```python
from src.pipeline import MessageProcessor

processor = MessageProcessor()
result = processor.process("Hello friend!", age_range="8-10")

print(result.classification)  # GREEN
print(result.feedback)         # None (GREEN messages don't need feedback)
```

### API Client
```python
import requests

response = requests.post(
    "http://localhost:8000/analyze",
    json={
        "message": "You're stupid",
        "age_range": "8-10"
    }
)

data = response.json()
print(data["classification"])  # RED
print(data["feedback"])        # Educational feedback
```

See [examples/](examples/) directory for more examples.

## 🐛 Troubleshooting

### Server Won't Start

```bash
# Check if port 8000 is in use
lsof -i :8000

# Install dependencies manually
python3 -m pip install -r requirements.txt

# Try manual start
python3 main.py --api
```

### Module Not Found Errors

```bash
# Ensure you're in the backend directory
cd backend

# Install all dependencies
python3 -m pip install -r requirements.txt
```

### Python Version Issues

```bash
# Check Python version (need 3.8+)
python3 --version

# Install Python 3.8+ if needed
brew install python3  # macOS
```

### Hugging Face API Errors

- **Symptom**: Feedback generation fails
- **Cause**: Invalid or missing HF_API_KEY
- **Fix**: System automatically falls back to template-based feedback
- **Optional**: Get a free API key at https://huggingface.co/settings/tokens

## 📚 Documentation

- **[Startup Guide](docs/STARTUP.md)** - Detailed installation and startup instructions
- **[Hugging Face Setup](docs/HUGGINGFACE_SETUP.md)** - LLM integration guide
- **[Data Pipeline](docs/DATA_PIPELINE.md)** - Pipeline architecture details
- **[Testing Guide](docs/TESTING.md)** - Testing and validation

## 🎯 Key Features

### For Children
- Real-time feedback as they type
- Educational guidance, not punishment
- Age-appropriate language (8-10, 11-13)
- Suggestions for better phrasing

### For Parents
- Pattern-based insights
- Privacy-first analysis
- No raw message storage
- Weekly behavioral themes

### Technical
- Fast response times (<500ms typical)
- Response caching for performance
- Graceful fallbacks (templates if LLM unavailable)
- RESTful API with OpenAPI docs
- Comprehensive test coverage

## 🔒 Privacy

- **No data storage**: Messages are analyzed in real-time and not stored
- **Local processing**: ML models run on your machine
- **Optional cloud**: Hugging Face API calls only if API key provided
- **Pattern-only reporting**: Parents see themes, not individual messages

## 👥 Team

**Team MLTPY**:
- **Mel** - Design & Frontend
- **Lucas** - Research & ML
- **Prags** - Systems, ML, Full Stack
- **Tyler** - Infrastructure
- **Yulei** - Data, ML, Full Stack

Built for the **eSafety Hackathon**.

## 📄 License

MIT License

---

**Part of the KindNet project** - [See main README](../README.md)
