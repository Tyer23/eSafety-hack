## KindNet Web App

Next.js 14 + React 18 + TypeScript prototype of the **KindNet** parent dashboard, based on the _Digital Guardian - AI Safety Guide for Children_ spec.

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.5
- **Styling:** Tailwind CSS 3.4 + iOS 18 Design System
- **UI Components:** Radix UI + Class Variance Authority (CVA)
- **Icons:** Lucide React
- **Utilities:** clsx + tailwind-merge

### Design System

This project uses a comprehensive iOS 18-inspired design system with:
- Design tokens (colors, typography, spacing, shadows)
- Reusable UI primitives (Button, Card, Input, Badge, ChatBubble, Icon)
- Accessibility-first components (WCAG AA compliance)
- Mobile-first responsive patterns
- Comprehensive icon system with Lucide React
- Jellybeat mascot with semantic color variants

**📖 Design System Documentation:** `.design-system/design-system.md`
**📖 Icon System Guide:** `.design-system/icon-system-guide.md`

### Jellybeat Mascot

KindNet uses **Jellybeat**, a friendly jellyfish mascot, throughout the app. The mascot comes in 4 color variants with specific semantic meanings:

| Variant | File | Use Case | Example |
|---------|------|----------|---------|
| **Rainbow** | `jellybeat-rainbow-full.png` | Default/primary branding | Logo, navigation, favicon |
| **Green** | `jellybeat-green-full.png` | Success states | Completion messages, positive feedback |
| **Amber** | `jellybeat-amber-full.png` | Loading/warning states | Loading screens, cautionary messages |
| **Red** | `jellybeat-red-full.png` | Error states | 404 pages, error messages |

#### Using the Logo Component

```tsx
import Logo from '@/components/Logo'

// Default: horizontal lockup with rainbow Jellybeat
<Logo />

// Icon only
<Logo variant="icon" size="lg" />

// Success state with green Jellybeat
<Logo jellybeatVariant="green" />

// Loading state with amber Jellybeat
<Logo jellybeatVariant="amber" />

// Error state with red Jellybeat
<Logo variant="icon" jellybeatVariant="red" size="xl" />
```

#### Direct Image Usage

For custom implementations, mascot assets are located at:
- **Source:** `.design-system/assets-mascot/jellybeat-{color}-full.png`
- **Public:** `/images/jellybeat-{color}-full.png`

All mascot images are 600×600px PNG files with transparency.

### What's Included

- **Local "DB"**: file-based mock data in `data/users.json` and `data/words.json`
- **APIs**:
  - `POST /api/login` – validates username/password against `data/users.json`
  - `GET /api/parent/summary` – returns static JSON summary of weekly patterns
- **Parent Dashboard UI**:
  - iOS 18-styled navigation and layout
  - Chat interface with iMessage-style bubbles
  - Weekly insights with metric badges
  - Patterns & data visualizations
  - Activity calendar
  - Theme trends graph

### Running the App

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open http://localhost:3000 and click **"Log in as parent_01"** to reach the dashboard.

Demo credentials (stored in `data/users.json`):
- Username: `parent_01`
- Password: `1234`

### Project Structure

```
web/
├── app/                    # Next.js 14 App Router
│   ├── parent/            # Parent dashboard routes
│   │   ├── page.tsx       # Chat interface
│   │   ├── insights/      # Weekly insights
│   │   └── patterns/      # Patterns & data
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles + Tailwind
│
├── components/            # React components
│   ├── ui/               # Design system primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   └── chat-bubble.tsx
│   └── [feature components]
│
├── lib/                   # Utilities
│   └── utils.ts          # cn() utility for class merging
│
├── .design-system/        # Design system documentation
│   └── design-system.md  # Complete design system reference
│
├── data/                  # Mock data
├── tailwind.config.mjs   # Design tokens configuration
└── tsconfig.json
```

### For Developers

**Using the Design System:**
All components follow iOS 18 design patterns with consistent:
- Colors, typography, spacing from design tokens
- Radix UI for accessibility
- CVA for type-safe variants
- Lucide icons for consistent iconography

**📖 Full documentation:** `.design-system/design-system.md`

### Demo Pages

- `/` - Login page
- `/parent` - Chat interface with AI assistant
- `/parent/insights` - Weekly insights dashboard
- `/parent/patterns` - Patterns & data visualizations
- `/test` - Design token showcase
- `/components-demo` - Component library demo


