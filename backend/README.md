# 🛡️ Kid Message Safety & Communication Coach

> **"We help you say it better, not stop you from saying it."**

AI-powered system helping children (ages 8-13) improve their digital communication by detecting harmful messages and providing constructive, age-appropriate feedback using Hugging Face LLM.

## ✨ Features

- **🔍 Smart Detection**: Catches profanity, threats, insults, and toxic patterns
- **🚦 Three-Tier Classification**: GREEN (safe), YELLOW (needs work), RED (harmful)
- **💬 Personalized Feedback**: Uses Hugging Face LLM for constructive, tailored responses
- **👶 Age-Appropriate**: Tailored for ages 8-10 and 11-13
- **⚡ Fast & Private**: Works locally, no data storage

## 🚀 Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up Hugging Face API key (get free token from https://huggingface.co/settings/tokens)
# Create a .env file in the project root:
echo "HF_API_KEY=your_token_here" > .env

# 3. Run interactive mode
python main.py

# Or run demo
python main.py --demo

# Or start API server
python main.py --api
```

## 📊 Example Output

```
📝 Message: fuck you go die

🚫 Classification: RED

💬 I can tell you're feeling really frustrated right now. Those words 
   can be really hurtful and aren't okay to use, even when we're upset.
   Let's find a better way to express what you're feeling.

💡 Better ways to say this:
   • I'm really frustrated right now
   • This is making me upset
   • I need to take a break
```

## 🔌 REST API

```bash
# Start server
python main.py --api

# Or use uvicorn directly
uvicorn src.api.app:app --reload

# Analyze a message
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "You are stupid"}'

# Quick classify
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{"message": "fuck off"}'
```

API docs: http://localhost:8000/docs

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_classification.py -v

# With coverage
python -m pytest tests/ --cov=src
```

## 📁 Project Structure

```
kids_helper/
├── src/
│   ├── analyzer/        # Toxicity, emotion, pattern detection
│   ├── classifier/      # Decision engine (GREEN/YELLOW/RED)
│   ├── feedback/        # Feedback generation
│   ├── api/             # FastAPI REST interface
│   ├── utils/           # Config, logging
│   ├── models.py        # Data models
│   ├── pipeline.py      # Main processor
│   └── preprocessor.py  # Text cleaning
├── tests/               # Test suite
├── examples/            # Usage examples
├── main.py              # Entry point
└── requirements.txt
```

## 🎯 Classification Rules

| Level | Triggers | Examples |
|-------|----------|----------|
| 🟢 GREEN | Safe, constructive | "Hello!", "Can we try again?" |
| 🟡 YELLOW | Dismissive, mild criticism | "Whatever", "This is boring" |
| 🔴 RED | Profanity, threats, attacks | "fuck you", "go die", "you're stupid" |

## ⚙️ Configuration

Environment variables (create `.env` file):
```bash
# Required: Hugging Face API key (get from https://huggingface.co/settings/tokens)
HF_API_KEY=your_token_here

# Optional: Override default model
HF_MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2

# Optional: Other settings
DEVICE=cpu              # cpu or cuda
DEFAULT_AGE_RANGE=8-10  # 8-10 or 11-13
API_PORT=8000
```

**Note**: If `HF_API_KEY` is not set, the system will automatically fall back to template-based feedback.

## 🤖 Hugging Face LLM

The system uses Hugging Face's free Inference API for personalized feedback:

- **Free tier**: 1,000 requests/month (can request more)
- **No credit card required**
- **Fast and reliable**: ~2-5s latency per request

See [docs/HUGGINGFACE_SETUP.md](docs/HUGGINGFACE_SETUP.md) for detailed setup instructions.

## 🔒 Privacy

- No message storage
- Local processing (ML classification models run on your machine)
- Hugging Face API calls for feedback generation (no data stored by HF)

## 📖 Use Cases

- Chat app moderation
- Gaming platforms
- Educational tools
- Parental controls
- Teaching digital citizenship

---

Made with ❤️ to help kids communicate better online.

