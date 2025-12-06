# KindNet Web Frontend

> Next.js 14 frontend for the KindNet digital literacy companion

Modern, accessible web interface built with Next.js, TypeScript, and an iOS 18-inspired design system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📋 Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Backend API** running on port 8000 (see [backend setup](../backend/README_STARTUP.md))

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Components**: Radix UI primitives + CVA
- **Icons**: Lucide React
- **State**: React hooks (useState, useEffect)
- **API**: Next.js API routes (server-side proxies)

## 📁 Project Structure

```
web/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                  # Login/Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles + Tailwind
│   ├── parent/                   # Parent routes
│   │   ├── page.tsx              # Chat/Dashboard (main)
│   │   ├── insights/page.tsx     # Insights view
│   │   └── patterns/page.tsx     # Patterns view
│   ├── child/[kidId]/            # Child routes (dynamic)
│   │   ├── page.tsx              # Browser interface
│   │   └── layout.tsx            # Child layout
│   └── api/                      # Server-side API routes
│       ├── login/route.ts        # Authentication
│       ├── ml/analyze/route.ts   # ML proxy to backend
│       ├── chat/route.ts         # AI chat proxy
│       └── jellybeat/route.ts    # Mascot feedback
│
├── components/                   # React components
│   ├── ui/                       # Design system primitives
│   │   ├── button.tsx            # Button variants
│   │   ├── card.tsx              # Card components
│   │   ├── input.tsx             # Form inputs
│   │   ├── badge.tsx             # Status badges
│   │   ├── chat-bubble.tsx       # iMessage-style bubbles
│   │   └── icon.tsx              # Icon wrapper
│   ├── ParentDashboard.tsx       # Parent main view
│   ├── ParentChatPanel.tsx       # AI chat interface
│   ├── ParentSummaryPanel.tsx    # Summary cards
│   ├── ParentWordsPanel.tsx      # Word patterns view
│   ├── ThemeTrendsGraph.tsx      # Data visualization
│   ├── Navigation.tsx            # Desktop nav
│   ├── MobileBottomNav.tsx       # Mobile navigation
│   ├── MobileHeader.tsx          # Mobile header
│   ├── ResponsiveLayout.tsx      # Layout wrapper
│   ├── Logo.tsx                  # KindNet logo component
│   └── Footer.tsx                # Footer with MVP badge
│
├── lib/                          # Utilities
│   ├── utils.ts                  # cn() utility, helpers
│   └── constants.ts              # App constants
│
├── types/                        # TypeScript types
│   └── index.ts                  # Shared type definitions
│
├── public/                       # Static assets
│   ├── images/                   # Images, videos
│   │   ├── jellybeat-*.png       # Mascot variants
│   │   ├── kindnet-logo.png      # Logo
│   │   └── jellybeat-traffic-vid.mp4
│   └── favicon.png
│
├── .design-system/               # Design documentation
│   ├── design-system.md          # Complete design guide
│   ├── assets-mascot/            # Mascot source files
│   └── layout-inspo/             # Design inspiration
│
├── data/                         # Local JSON "database"
│   ├── users.json                # User credentials
│   └── words.json                # Child activity data
│
├── tailwind.config.mjs           # Tailwind + design tokens
├── tsconfig.json                 # TypeScript config
├── next.config.mjs               # Next.js config
└── package.json                  # Dependencies
```

## 🎭 Routes

### Public Routes
- `/` - Login/Landing page with hero section

### Parent Routes (Authenticated)
- `/parent` - Main dashboard with AI chat
- `/parent/insights` - Behavioral insights view
- `/parent/patterns` - Pattern analysis view

### Child Routes (Authenticated)
- `/child/[kidId]` - Child browser interface with mascot

### API Routes (Server-Side)
- `POST /api/login` - Authentication
- `POST /api/ml/analyze` - ML text analysis (proxy to Python backend)
- `POST /api/chat` - AI chat (proxy to backend)
- `POST /api/jellybeat` - Mascot feedback generation

## 🎨 Design System

This project uses a comprehensive design system inspired by iOS 18. See [.design-system/design-system.md](.design-system/design-system.md) for:

- **Design tokens** (colors, typography, spacing)
- **Component specifications** (Button, Card, Input, Badge, etc.)
- **Coding standards** (TypeScript, Tailwind, React patterns)
- **Accessibility requirements** (WCAG AA compliance)
- **Icon system** (Lucide React integration)

### Key Design Tokens

```tsx
// Colors
className="bg-blurple text-safe border-gray-200"

// Typography
className="text-large-title font-semibold leading-tight"

// Spacing
className="p-6 gap-4 m-auto"

// Shadows (iOS 18 subtle)
className="shadow-soft shadow-card shadow-float"

// Border Radius
className="rounded-lg rounded-xl rounded-2xl"
```

### Component Usage

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/Logo'

// Button variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// Cards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Badges
<Badge variant="default">Blurple</Badge>
<Badge variant="success">Green</Badge>
<Badge variant="warning">Amber</Badge>

// Logo
<Logo variant="horizontal" size="md" jellybeatVariant="kindnet" />
```

### Jellybeat Mascot

KindNet uses **Jellybeat**, a friendly mascot, throughout the app. The mascot comes in 4 color variants with specific semantic meanings:

| Variant | File | Use Case |
|---------|------|----------|
| **Rainbow** | `jellybeat-rainbow-full.png` | Default/primary branding |
| **Green** | `jellybeat-green-full.png` | Success states |
| **Amber** | `jellybeat-amber-full.png` | Loading/warning states |
| **Red** | `jellybeat-red-full.png` | Error states |

```tsx
// Success state
<Logo jellybeatVariant="green" variant="icon" size="xl" />

// Loading state
<Logo jellybeatVariant="amber" variant="icon" size="lg" />

// Error state
<Logo jellybeatVariant="red" variant="icon" size="xl" />
```

## 🔌 API Integration

The frontend connects to the Python ML backend via Next.js API routes (server-side proxies):

```typescript
// Frontend → Next.js API Route → Python Backend

// Example: Child types message
fetch('/api/ml/analyze', {
  method: 'POST',
  body: JSON.stringify({ message: 'text', age_range: '8-10' })
})
// ↓
// web/app/api/ml/analyze/route.ts forwards to:
// ↓
// http://localhost:8000/analyze (Python FastAPI)
```

**Environment Variables:**

Create `.env.local`:
```bash
# Backend URL (default: http://localhost:8000)
ML_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# TypeScript type checking
npm run build

# Linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 📱 Responsive Design

Mobile-first approach with breakpoints:

```tsx
// Mobile (default) → Tablet (md) → Desktop (lg)
className="flex flex-col md:flex-row lg:max-w-6xl"

// Show/hide by breakpoint
className="block md:hidden"        // Mobile only
className="hidden md:block"        // Tablet+ only
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🎯 Key Features

### Login Page
- Hero section with animated mascot video
- Dual role selection (Parent/Child)
- Responsive feature cards
- Demo account credentials

### Parent Dashboard
- AI-powered chat interface
- Pattern-based insights (not raw messages)
- Weekly summaries
- Behavioral trends visualization

### Child Browser
- Real-time mascot feedback
- Traffic light classification (GREEN/YELLOW/RED)
- Educational guidance
- Safe exploration environment

## 🔧 Configuration

### Tailwind Config

Design tokens are defined in `tailwind.config.mjs`:
- Colors (blurple, safe, caution, alert)
- Typography scale (iOS standard)
- Spacing (4px base unit)
- Shadows (iOS 18 subtle)

### TypeScript Config

Path aliases configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 🐛 Common Issues

### Build Errors

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### API Connection Issues

- **Symptom**: `Failed to connect to ML backend`
- **Cause**: Backend not running
- **Fix**: Start backend in separate terminal:
  ```bash
  cd ../backend && ./start.sh
  ```

### Type Errors

```bash
# Check for errors
npm run build

# Common fixes:
- Ensure all imports have proper types
- Check for missing @types/* packages
- Verify API response types match backend
```

## 📚 Demo Pages

- `/` - Login page with hero section
- `/parent` - Chat interface with AI assistant
- `/parent/insights` - Weekly insights dashboard
- `/parent/patterns` - Patterns & data visualizations
- `/child/kid_01` - Child browser (Jamie, 9 years old)
- `/child/kid_02` - Child browser (Emma, 11 years old)
- `/test` - Design token showcase
- `/components-demo` - Component library demo

## 📚 Resources

- **[Next.js 14 Docs](https://nextjs.org/docs)** - App Router, API routes
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com)** - Accessible primitives
- **[Lucide Icons](https://lucide.dev)** - Icon library
- **[TypeScript](https://www.typescriptlang.org/docs)** - Language docs

## 👥 Team

**Team MLTPY**:
- **Mel** - Design & Frontend
- **Lucas** - ML & Backend
- **Prags** - Full Stack
- **Tyler** - Backend & Infrastructure
- **Yulei** - ML & Data

Built for the **eSafety Hackathon**.

## 📄 License

MIT License

---

**Part of the KindNet project** - [See main README](../README.md)
