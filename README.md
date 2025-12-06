# KindNet

> **Being safe, being kind, asking for help, and making good choices.**

KindNet is an AI-powered digital literacy companion that helps children (ages 8-13) develop healthy online habits through real-time, non-restrictive guidance. Rather than blocking content, it provides contextual education at the moment of interaction, fostering trust between parents and children while building essential digital citizenship skills.

## 🏆 Hackathon Project

Built for the **eSafety Hackathon** by Team **MLTPY**:

- **Mel** - Design & Frontend
- **Lucas** - Research & ML
- **Prags** - Systems, ML, Full Stack
- **Tyler** - Infrastructure
- **Yulei** - Data, ML, Full Stack

## 🎯 Core Philosophy

- **Education over restriction** - Guide, don't gatekeep
- **Autonomy with awareness** - Children make informed choices
- **Trust-building** - Foster parent-child relationships through transparency
- **Privacy-first** - Pattern insights, not surveillance

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         KindNet                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────┐         ┌──────────────────┐       │
│  │   Frontend (Web)  │────────▶│  Backend (ML)    │       │
│  │   Next.js 14      │         │  Python FastAPI  │       │
│  │   Port 3001       │         │  Port 8000       │       │
│  │                   │         │                  │       │
│  │  • Login/Auth     │         │  • Text Analysis │       │
│  │  • Parent View    │         │  • ML Models     │       │
│  │  • Child Browser  │         │  • Classification│       │
│  │  • AI Chat UI     │         │  • Feedback Gen  │       │
│  └───────────────────┘         └──────────────────┘       │
│           │                              │                 │
│           │                              ▼                 │
│           │                    ┌──────────────────┐       │
│           │                    │  Hugging Face    │       │
│           │                    │  LLM API         │       │
│           │                    │  (Optional)      │       │
│           │                    └──────────────────┘       │
│           ▼                                                │
│  ┌───────────────────┐                                    │
│  │   Local JSON DB   │                                    │
│  │   users.json      │                                    │
│  │   words.json      │                                    │
│  └───────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/Tyer23/eSafety-hack.git
cd eSafety-hack
```

### 2. Start Backend (Terminal 1)

```bash
cd backend
./start.sh
```

Expected output:

```
✅ Started server on http://0.0.0.0:8000
📚 API docs: http://localhost:8000/docs
```

### 3. Start Frontend (Terminal 2)

```bash
cd web
npm install
npm run dev
```

Expected output:

```
✓ Ready on http://localhost:3001
```

### 4. Open Browser

Navigate to **http://localhost:3001**

**Demo Accounts:**

- **Parent**: `parent_01` / `1234`
- **Child (Jamie)**: `kid_01` / `abcd`
- **Child (Emma)**: `kid_02` / `efgh`

## 📁 Project Structure

```
eSafety-hack/
├── web/                          # Next.js Frontend
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Login page
│   │   ├── parent/               # Parent dashboard
│   │   ├── child/[kidId]/        # Child browser
│   │   └── api/                  # Next.js API routes (proxies)
│   ├── components/               # React components
│   │   ├── ui/                   # Design system primitives
│   │   ├── ParentDashboard.tsx
│   │   └── Footer.tsx
│   ├── .design-system/           # Design tokens & guidelines
│   └── public/                   # Static assets
│
├── backend/                      # Python ML Backend
│   ├── main.py                   # FastAPI entry point
│   ├── src/
│   │   ├── analyzer/             # Toxicity, emotion detection
│   │   ├── classifier/           # GREEN/YELLOW/RED logic
│   │   ├── feedback/             # AI feedback generation
│   │   └── api/                  # FastAPI routes
│   ├── tests/                    # Test suite
│   └── requirements.txt          # Python dependencies
│
├── data/                         # Local JSON "database"
│   ├── users.json                # Login credentials
│   └── words.json                # Child activity data
│
└── README.md                     # This file
```

## 🎨 Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI + CVA
- **Icons**: Lucide React
- **Design**: iOS 18-inspired aesthetic

### Backend

- **Framework**: FastAPI (Python)
- **ML Models**: Hugging Face Transformers
- **Text Analysis**: Toxicity detection, emotion analysis
- **API**: RESTful endpoints with auto-generated docs

### Data

- **Storage**: Local JSON files (MVP)
- **Future**: PostgreSQL + Redis

## 🔑 Key Features

### For Parents

- **Pattern-Based Insights**: See behavioral themes, not individual messages
- **AI Chat Assistant**: Natural language queries about your child's digital habits
- **Weekly Summaries**: Digestible reports focused on growth and learning
- **Privacy Guardrails**: No access to raw messages or browsing history

### For Children

- **Real-Time Guidance**: Friendly mascot provides feedback as they type
- **Traffic Light System**: 🟢 Safe, 🟡 Caution, 🔴 Concerning
- **Educational Feedback**: Learn why certain language might be harmful
- **Autonomy**: Children maintain full control of their choices

## 📚 Documentation

- **[Design System](web/.design-system/design-system.md)** - UI components, tokens, patterns
- **[Backend Setup](backend/README_STARTUP.md)** - ML API startup guide
- **[AI Safety Guide](AI%20Safety%20Guide%20for%20Children.md)** - Product vision & philosophy
- **[API Docs](http://localhost:8000/docs)** - Interactive API documentation (when backend is running)

## 🧪 Testing

### Frontend

```bash
cd web
npm run build    # Check for TypeScript errors
npm run lint     # ESLint validation
```

### Backend

```bash
cd backend
python -m pytest tests/ -v
```

## 🔧 Configuration

### Backend Environment (Optional)

Create `backend/.env`:

```bash
# Optional: Hugging Face API key for better AI responses
HF_API_KEY=your_token_here

# Optional: Override defaults
API_PORT=8000
DEVICE=cpu
```

**Note**: The system works without `HF_API_KEY` using template-based feedback.

### Frontend Environment

Create `web/.env.local`:

```bash
# Override ML backend URL (default: http://localhost:8000)
ML_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 8000 is in use
lsof -i :8000

# Install dependencies manually
cd backend
python3 -m pip install -r requirements.txt
```

### Frontend won't start

```bash
# Clear cache and reinstall
cd web
rm -rf node_modules .next
npm install
npm run dev
```

### Parent login shows error

- **Cause**: Backend not running
- **Fix**: Start the backend in a separate terminal (see Step 2 above)

### "Module not found" errors

```bash
# Backend
cd backend && python3 -m pip install -r requirements.txt

# Frontend
cd web && npm install
```

## 🚧 Known Limitations (MVP)

- Local JSON storage only (no database)
- No real authentication (demo accounts hardcoded)
- Single-user sessions (no multi-tab support)
- ML API must run locally (no cloud deployment yet)
- Limited browser history (child interface is a prototype)

## 🛣️ Roadmap

### Phase 1: MVP ✅

- [x] Core mascot functionality
- [x] Basic ML classification
- [x] Parent dashboard prototype
- [x] Child browser interface

### Phase 2: Enhancement (In Progress)

- [ ] Real database (PostgreSQL)
- [ ] User authentication (JWT)
- [ ] Improved ML accuracy
- [ ] Mobile responsive optimizations

### Phase 3: Scale

- [ ] Multi-child support
- [ ] Cloud deployment
- [ ] Premium features
- [ ] Educational content library

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a hackathon project. For questions or collaboration:

- **Discord**: quocco (Tyler)
- **Team Chat**: MLTPY group

## 🙏 Acknowledgments

- **eSafety Hackathon** organizers
- **Hugging Face** for ML models and API
- **Radix UI** for accessible component primitives
- **Next.js** team for the amazing framework

---

**Built with ❤️ by Team MLTPY for the eSafety Hackathon**

_"Empowering children to navigate the digital world safely, kindly, and independently."_
