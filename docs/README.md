# KindNet Documentation

Central documentation hub for the KindNet project.

## 📚 Core Documentation

### Product & Vision
- **[AI Safety Guide](AI-SAFETY-GUIDE.md)** - Product philosophy, vision, and AI safety principles for children

### Project Overview
- **[Main README](../README.md)** - Project overview, quick start, and team information
- **[Frontend README](../web/README.md)** - Next.js web application documentation
- **[Backend README](../backend/README.md)** - Python ML API documentation

## 🏗️ Component Documentation

### Frontend (Next.js)
Located in [`web/docs/`](../web/docs/):
- **[Chat System](../web/docs/CHAT_SYSTEM.md)** - Parent chat interface and session management
- **[Data Flow](../web/docs/CURRENT_DATA_FLOW.md)** - How data flows through the app
- **[ML Integration](../web/docs/ML_INTEGRATION_SUMMARY.md)** - ML scores integration details
- **[ML Algorithms](../web/docs/ML_SCORES_ALGORITHMS.md)** - Score calculation algorithms
- **[Design System](../web/.design-system/design-system.md)** - UI components, tokens, and patterns

### Backend (Python ML API)
Located in [`backend/docs/`](../backend/docs/):
- **[Startup Guide](../backend/docs/STARTUP.md)** - Installation and server setup
- **[Hugging Face Setup](../backend/docs/HUGGINGFACE_SETUP.md)** - LLM integration guide
- **[Data Pipeline](../backend/docs/DATA_PIPELINE.md)** - ML pipeline architecture
- **[Testing Guide](../backend/docs/TESTING.md)** - Testing and validation

## 📦 Archive

Historical documentation and PR summaries:
- **[Archive](archive/)** - Outdated docs, PR summaries, and historical context

## 🎯 Documentation Organization

```
eSafety-hack/
├── README.md                      # Main project README
├── docs/                          # Central documentation
│   ├── README.md (this file)      # Documentation index
│   ├── AI-SAFETY-GUIDE.md         # Product vision
│   └── archive/                   # Historical docs
│       ├── CHANGELOG.md
│       ├── PR-2-SUMMARY.md
│       ├── project-notes-feat-child-op.md
│       └── SCORING_SUMMARY.md
│
├── backend/                       # ML Backend
│   ├── README.md                  # Backend README
│   └── docs/                      # Backend documentation
│       ├── STARTUP.md
│       ├── HUGGINGFACE_SETUP.md
│       ├── DATA_PIPELINE.md
│       ├── TESTING.md
│       └── archive/               # Archived backend docs
│           ├── CSV_CLASSIFICATION_SUMMARY.md
│           ├── PIPELINE_TEST_RESULTS.md
│           └── SETUP_COMPLETE.md
│
└── web/                           # Frontend
    ├── README.md                  # Frontend README
    ├── .design-system/            # Design system docs
    │   └── design-system.md
    └── docs/                      # Frontend documentation
        ├── CHAT_SYSTEM.md
        ├── CURRENT_DATA_FLOW.md
        ├── ML_INTEGRATION_SUMMARY.md
        ├── ML_SCORES_ALGORITHMS.md
        └── archive/               # Archived web docs
            └── COMPONENT-CHECKLIST.md
```

## 🔍 Quick Links by Topic

### Getting Started
1. [Project README](../README.md) - Start here
2. [Backend Setup](../backend/docs/STARTUP.md) - Start ML API
3. [Frontend Setup](../web/README.md) - Start Next.js app

### Understanding the Product
1. [AI Safety Guide](AI-SAFETY-GUIDE.md) - Philosophy and vision
2. [Data Flow](../web/docs/CURRENT_DATA_FLOW.md) - How the system works
3. [ML Pipeline](../backend/docs/DATA_PIPELINE.md) - ML architecture

### Development
1. [Design System](../web/.design-system/design-system.md) - UI guidelines
2. [Testing](../backend/docs/TESTING.md) - Test suite
3. [ML Integration](../web/docs/ML_INTEGRATION_SUMMARY.md) - Frontend-backend integration

## 📝 Documentation Standards

### File Naming
- Use UPPERCASE-WITH-DASHES.md for docs (e.g., `AI-SAFETY-GUIDE.md`)
- Use descriptive names that indicate content
- Keep filenames concise but clear

### Location Guidelines
- **Product/vision docs** → `docs/`
- **Backend technical docs** → `backend/docs/`
- **Frontend technical docs** → `web/docs/`
- **Outdated/historical** → `*/docs/archive/`
- **README files** → At component root level

### When to Archive
Archive documentation when:
- It describes a completed implementation phase
- It's been superseded by newer documentation
- It's historical context (PR summaries, old notes)
- It's no longer relevant to current development

**Do NOT archive:**
- Active setup guides
- Current API documentation
- Design system documentation
- Testing guides

## 🤝 Contributing to Documentation

When adding new documentation:
1. Place it in the appropriate `docs/` directory
2. Update this index file with a link
3. Use clear, concise language
4. Include code examples where applicable
5. Add links to related documentation

## 👥 Team

**Team MLTPY**:
- **Mel** - Design & Frontend
- **Lucas** - Research & ML
- **Prags** - Systems, ML, Full Stack
- **Tyler** - Infrastructure
- **Yulei** - Data, ML, Full Stack

Built for the **eSafety Hackathon**.
