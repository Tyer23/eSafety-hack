# KindNet Design System

**Version:** 1.0.0
**Last Updated:** December 2024
**For:** MLTPY Team (Mel, Lucas, Prags, Tyler, Yulei)
**Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI, Lucide Icons

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Setup & Installation](#setup--installation)
4. [Design Tokens](#design-tokens)
   - [Colors](#colors)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Border Radius](#border-radius)
   - [Shadows](#shadows)
   - [Z-Index](#z-index)
   - [Breakpoints](#breakpoints)
   - [Animations](#animations)
5. [Icon System](#icon-system)
6. [Jellybeat Mascot](#jellybeat-mascot)
7. [Component Architecture](#component-architecture)
8. [Component Specifications](#component-specifications)
9. [Coding Standards](#coding-standards)
10. [Accessibility](#accessibility)
11. [Responsive Patterns](#responsive-patterns)
12. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
13. [Component Checklist](#component-checklist)
14. [Quick Reference](#quick-reference)
15. [Resources](#resources)
16. [Need Help?](#need-help)

---

## Overview

### The Problem
KindNet is a "vibe coded by variety of devs" project that needs **strong guardrails** to ensure consistent, accessible, iOS 18-styled components.

### The Solution
This design system provides a single source of truth for:
- Design tokens (colors, typography, spacing)
- Component specifications
- Coding standards and best practices
- Accessibility requirements
- Integration patterns with Radix UI + CVA + Lucide

---

## Design Philosophy

KindNet follows **Apple's iOS 18 design language**:

### Core Visual Principles
- **Clean, minimal, flat design** - No heavy shadows or gradients
- **Generous white space** - Let content breathe
- **Soft, barely-visible shadows** - iOS 18 subtlety
- **Modern sans-serif typography** - SF Pro family aesthetic
- **Circular icon badges** - Friendly, approachable
- **Accessible, high-contrast colors** - WCAG AA minimum

### Product Principles
1. **Clarity** - Simple, uncluttered interfaces
2. **Trust** - Professional, calm aesthetic (not surveillance-focused)
3. **Privacy-first** - Visual language respects parent/child boundaries
4. **Modern** - 2024/2025 Apple aesthetic

---

## Setup & Installation

### 1. Install Dependencies

```bash
# Core utilities
npm install clsx tailwind-merge class-variance-authority

# Icons
npm install lucide-react

# Radix UI components (install only what you need)
npm install @radix-ui/react-slot
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-popover
npm install @radix-ui/react-tabs
```

### 2. Create cn() Utility

```bash
mkdir -p lib
```

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 3. Update Tailwind Config

Your `tailwind.config.mjs` should include all design tokens. Reference the existing config in the project.

### 4. Update TypeScript Config

Ensure `tsconfig.json` has path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Design Tokens

### Colors

#### Primary Colors
```css
/* Brand Purple-Blue (Blurple) */
--blurple: #6B7FFF;              /* Primary buttons, links, active states */
--blurple-light: #E8EBFF;        /* Light backgrounds, hover states */
--blurple-dark: #4A5FCC;         /* Dark mode, emphasis */

/* Traffic Light System (Status) */
--safe: #7ED957;                 /* Positive communication patterns */
--caution: #FF9F40;              /* Needs guidance, neutral flags */
--alert: #FF6B6B;                /* Concerning patterns (use sparingly) */

/* Dark variants */
--safe-dark: #5FB839;
--caution-dark: #E88A2F;
--alert-dark: #E85555;
```

#### Neutral Colors (iOS 18 System)
```css
/* Backgrounds */
--bg-primary: #FFFFFF;           /* Main app background */
--bg-secondary: #F9F9F9;         /* Subtle contrast areas */
--bg-tertiary: #F2F2F7;          /* Card backgrounds on white */

/* Text */
--text-primary: #1C1C1E;         /* Main content (iOS System Black) */
--text-secondary: #48484A;       /* Supporting text */
--text-tertiary: #8E8E93;        /* Metadata, timestamps */

/* Borders & Dividers */
--divider: #E5E5EA;              /* Standard dividers */
--divider-subtle: #F2F2F7;       /* Barely-visible dividers */

/* Gray Scale */
--gray-50: #F9F9F9;
--gray-100: #F2F2F7;
--gray-200: #E5E5EA;
--gray-300: #D1D1D6;
--gray-400: #C7C7CC;
--gray-500: #AEAEB2;
--gray-600: #8E8E93;
--gray-700: #636366;
--gray-800: #48484A;
--gray-900: #1C1C1E;
```

#### Semantic Colors (Use Traffic Light System)
```css
/* Success/Positive - same as safe */
--success: #7ED957;
--success-bg: #E8F9EE;

/* Warning - same as caution */
--warning: #FF9F40;
--warning-bg: #FFF4E5;

/* Error - same as alert */
--error: #FF6B6B;
--error-bg: #FFE5E5;

/* Info - same as blurple */
--info: #6B7FFF;
--info-bg: #E8EBFF;
```

#### Tailwind Classes
```tsx
// Primary colors
className="bg-blurple text-blurple border-blurple"
className="bg-safe text-safe"
className="bg-caution text-caution"
className="bg-alert text-alert"

// Grays
className="bg-gray-50 text-gray-600 border-gray-200"
```

---

### Typography

#### Font Family
```css
--font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
```

#### Type Scale (iOS Standard)
```css
/* Display Sizes */
--text-large-title: 34px;        /* Bold - Screen titles */
--text-title-1: 28px;            /* Bold - Major sections */
--text-title-2: 22px;            /* Bold - Card headers */
--text-title-3: 20px;            /* Semibold - Subheaders */

/* Body Sizes */
--text-body: 17px;               /* Regular - Primary content (iOS default) */
--text-callout: 16px;            /* Regular - Secondary content */
--text-subhead: 15px;            /* Regular - Labels, small content */
--text-footnote: 13px;           /* Regular - Metadata */
--text-caption: 12px;            /* Regular - Timestamps, fine print */
```

#### Font Weights
```css
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

#### Line Heights
```css
--line-height-tight: 1.2;        /* Titles */
--line-height-normal: 1.4;       /* Body text */
--line-height-relaxed: 1.6;      /* Long-form content */
```

#### Letter Spacing
```css
--letter-spacing-tight: -0.4px;   /* Titles, large text */
--letter-spacing-body: -0.41px;   /* 17px body text (iOS spec) */
--letter-spacing-footnote: -0.08px; /* 13px footnote (iOS spec) */
--letter-spacing-wide: 0.5px;     /* All caps labels */
```

#### Tailwind Classes
```tsx
// Sizes
className="text-large-title"  // 34px
className="text-title-1"      // 28px
className="text-title-2"      // 22px
className="text-body"         // 17px (default)
className="text-subhead"      // 15px
className="text-footnote"     // 13px

// Weights
className="font-regular font-medium font-semibold font-bold"

// Line heights
className="leading-tight leading-normal leading-relaxed"
```

---

### Spacing

#### Base Unit: 4px
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

#### Layout Spacing
```css
--spacing-screen-margin: 20px;    /* iPhone screen edges */
--spacing-card-padding: 24px;     /* Inside cards */
--spacing-section: 32px;          /* Between major sections */
--spacing-component: 16px;        /* Between UI elements */
```

#### Tailwind Classes
```tsx
// Padding
className="p-4 px-6 py-3"

// Margin
className="m-4 mx-auto my-6"

// Gap (flexbox/grid)
className="gap-4 gap-x-6 gap-y-3"
```

---

### Border Radius

```css
--radius-sm: 8px;                 /* Small elements, badges */
--radius-md: 12px;                /* Buttons, inputs */
--radius-lg: 16px;                /* Cards, panels */
--radius-xl: 20px;                /* Large cards, modals */
--radius-2xl: 24px;               /* Full-screen elements */
--radius-full: 9999px;            /* Pills, circular elements */
```

#### Tailwind Classes
```tsx
className="rounded-lg"    // 12px
className="rounded-xl"    // 20px
className="rounded-2xl"   // 24px
className="rounded-full"  // Circle/pill
```

---

### Shadows

iOS 18 shadows are **very subtle**:

```css
--shadow-soft: 0 1px 4px rgba(0, 0, 0, 0.04);      /* Barely visible */
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);      /* Cards */
--shadow-elevated: 0 4px 16px rgba(0, 0, 0, 0.08); /* Modals, popovers */
```

#### Tailwind Classes
```tsx
className="shadow-sm"        // Soft shadow
className="shadow-card"      // Card shadow (custom)
className="shadow-elevated"  // Modal shadow (custom)
```

---

### Z-Index

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-fixed: 1200;
--z-modal-backdrop: 1300;
--z-modal: 1400;
--z-popover: 1500;
--z-tooltip: 1600;
```

---

### Breakpoints

Mobile-first approach. Design for **iPhone 14/15 Pro (393px width)** as default.

```css
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Laptops */
--screen-xl: 1280px;  /* Desktops */
--screen-2xl: 1536px; /* Large desktops */
```

#### Tailwind Classes
```tsx
// Mobile-first
className="flex flex-col md:flex-row lg:max-w-4xl"

// Responsive utilities
className="hidden md:block"     // Hide on mobile, show on tablet+
className="block md:hidden"     // Show on mobile, hide on tablet+
```

---

### Animations

#### Duration
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

#### Easing
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* iOS-style bounce */
```

#### Common Transitions
```tsx
// Standard fade
className="transition-opacity duration-normal ease-out"

// Scale (buttons, modals)
className="transition-transform duration-normal ease-spring active:scale-[0.98]"

// All properties
className="transition-all duration-normal"
```

---

## Icon System

**Library:** Lucide React (iOS-compatible, 2px stroke weight)
**Component:** `Icon` wrapper for consistent sizing and accessibility

### Why Lucide?
- Perfect iOS 18 match with 2px stroke weight (matches SF Symbols)
- Tree-shakeable (only bundle icons you use)
- Consistent sizing and styling
- React components with TypeScript support
- Active maintenance and large icon set (1000+ icons)

### Icon Component

KindNet provides an `Icon` component that enforces design system standards:

```tsx
import { Icon } from '@/components/ui/icon'
import { SendIcon, MessageCircleIcon } from '@/components/ui/icons'

// Standard usage with size variant
<Icon icon={SendIcon} size="md" />

// With custom styling
<Icon
  icon={MessageCircleIcon}
  size="lg"
  className="text-blurple"
  strokeWidth={2.5}
/>

// Icon-only button (not decorative, needs label)
<button aria-label="Close">
  <Icon icon={XIcon} size="lg" decorative={false} />
</button>
```

### Icon Sizes

| Size | Pixels | Tailwind | Use Case |
|------|--------|----------|----------|
| `sm` | 16px | `w-4 h-4` | Inline text, small buttons |
| `md` | 20px | `w-5 h-5` | Standard UI elements (default) |
| `lg` | 24px | `w-6 h-6` | Navigation, primary actions |
| `xl` | 32px | `w-8 h-8` | Feature highlights, metric badges |
| `2xl` | 48px | `w-12 h-12` | Large displays, hero sections |

```tsx
import { Icon } from '@/components/ui/icon'
import { MessageCircleIcon, SendIcon, MenuIcon, TrendingUpIcon, HeartIcon } from '@/components/ui/icons'

// Size examples
<Icon icon={MessageCircleIcon} size="sm" />   // 16px - Inline text
<Icon icon={SendIcon} size="md" />            // 20px - Standard UI
<Icon icon={MenuIcon} size="lg" />            // 24px - Navigation
<Icon icon={TrendingUpIcon} size="xl" />      // 32px - Feature highlights
<Icon icon={HeartIcon} size="2xl" />          // 48px - Large displays
```

### Available Icons

**Navigation & UI:** `ChevronLeft`, `ChevronRight`, `ChevronDown`, `ChevronUp`, `Menu`, `X`, `Search`, `Settings`

**Metrics & Status:** `TrendingUp`, `TrendingDown`, `Minus`

**Actions:** `Send`, `Plus`, `Edit`, `Trash2`, `Download`, `Upload`, `Filter`, `MoreHorizontal`, `MoreVertical`

**Communication:** `MessageCircle`, `Heart`, `ThumbsUp`, `Mail`

**Info & Alerts:** `Info`, `AlertCircle`, `AlertTriangle`, `Check`, `HelpCircle`, `XCircle`, `CheckCircle`

**Data & Charts:** `BarChart3`, `PieChart`, `LineChart`

**Time:** `Calendar`, `Clock`

**User Management:** `User`, `Users`

**Visibility:** `Eye`, `EyeOff`

**Security & Privacy:** `Shield`, `Lock`, `Unlock`

**Files:** `File`, `FileText`, `Image`

**Other:** `Home`, `Bell`, `Star`, `Share2`

See `components/ui/icons.ts` for the full list or browse [Lucide Icons](https://lucide.dev)

### Usage Patterns

#### Decorative Icons (Default)
Icons next to text are decorative and should have `aria-hidden="true"` (default):

```tsx
import { Icon } from '@/components/ui/icon'
import { SendIcon } from '@/components/ui/icons'

// Icon is decorative (default behavior)
<Button>
  <Icon icon={SendIcon} size="sm" />
  Send Message
</Button>
```

#### Standalone Icon Buttons
Icon-only buttons need `aria-label` and `decorative={false}`:

```tsx
// ✅ GOOD - Standalone icon with label
<button aria-label="Close modal">
  <Icon icon={XIcon} size="lg" decorative={false} />
</button>

// ❌ BAD - Missing aria-label
<button>
  <Icon icon={XIcon} size="lg" />
</button>
```

#### With Colors and Stroke
Icons use `currentColor` by default:

```tsx
// Color from design tokens
<Icon icon={TrendingUpIcon} size="xl" className="text-safe" />
<Icon icon={AlertTriangleIcon} size="md" className="text-alert" />

// Custom stroke weight (2px default, 2.5px for emphasis)
<Icon icon={MenuIcon} size="lg" strokeWidth={2.5} />
```

#### Navigation Icons

```tsx
import { Icon } from '@/components/ui/icon'
import { MessageCircleIcon, TrendingUpIcon, BarChart3Icon, SettingsIcon } from '@/components/ui/icons'

const navItems = [
  { icon: MessageCircleIcon, label: "Chat", href: "/parent" },
  { icon: TrendingUpIcon, label: "Insights", href: "/parent/insights" },
  { icon: BarChart3Icon, label: "Patterns", href: "/parent/patterns" },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
]

// In component
{navItems.map((item) => (
  <Link key={item.href} href={item.href}>
    <Icon icon={item.icon} size="lg" />
    <span>{item.label}</span>
  </Link>
))}
```

#### Metric Badges (Circular)

```tsx
import { Icon } from '@/components/ui/icon'
import { TrendingUpIcon, MinusIcon, TrendingDownIcon } from '@/components/ui/icons'

// Positive metric
<div className="w-16 h-16 rounded-full bg-safe flex items-center justify-center">
  <Icon
    icon={TrendingUpIcon}
    size="xl"
    className="text-white"
    strokeWidth={2.5}
    decorative={false}
    aria-label="Positive trend"
  />
</div>

// Neutral metric
<div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
  <Icon icon={MinusIcon} size="xl" className="text-white" strokeWidth={2.5} />
</div>

// Negative metric
<div className="w-16 h-16 rounded-full bg-caution flex items-center justify-center">
  <Icon icon={TrendingDownIcon} size="xl" className="text-white" strokeWidth={2.5} />
</div>
```

#### Search Input

```tsx
import { Icon } from '@/components/ui/icon'
import { SearchIcon } from '@/components/ui/icons'

<div className="relative">
  <Icon
    icon={SearchIcon}
    size="md"
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
  />
  <Input
    type="search"
    placeholder="Search..."
    className="pl-10"
  />
</div>
```

#### Back Button

```tsx
import { Icon } from '@/components/ui/icon'
import { ChevronLeftIcon } from '@/components/ui/icons'

<button
  onClick={handleBack}
  className="w-11 h-11 flex items-center justify-center rounded-lg transition-colors active:bg-gray-100"
  aria-label="Go back"
>
  <Icon icon={ChevronLeftIcon} size="lg" strokeWidth={2.5} decorative={false} />
</button>
```

### Alternative: Direct Import

You can also import icons directly from Lucide (without the Icon wrapper):

```tsx
import { Send } from 'lucide-react'

// Manual sizing required
<Send className="w-5 h-5" />
```

**Recommendation:** Use the `Icon` component for consistency and automatic accessibility handling.

### Adding New Icons

#### Option 1: Direct Import (Quick)

```tsx
import { Smile } from 'lucide-react'
import { Icon } from '@/components/ui/icon'

<Icon icon={Smile} size="md" />
```

#### Option 2: Add to Icons Collection (Recommended)

1. Open `components/ui/icons.ts`
2. Add to exports:

```ts
export {
  // ... existing icons
  Smile,
} from "lucide-react"

export {
  // ... existing Icon exports
  Smile as SmileIcon,
} from "lucide-react"
```

3. Use with consistent naming:

```tsx
import { SmileIcon } from '@/components/ui/icons'
<Icon icon={SmileIcon} size="md" />
```

### Icon Style Guidelines

#### ✅ DO
```tsx
// Use Icon component with size variants
<Icon icon={SendIcon} size="md" />

// Add aria-label to standalone icon buttons
<button aria-label="Close">
  <Icon icon={XIcon} size="lg" decorative={false} />
</button>

// Use design system colors
<Icon icon={TrendingUpIcon} size="xl" className="text-safe" />

// Use appropriate sizes for context
<Icon icon={MessageCircleIcon} size="sm" /> // In button text
<Icon icon={MenuIcon} size="lg" /> // In navigation
```

#### ❌ DON'T
```tsx
// Don't use arbitrary sizes
<Icon icon={SendIcon} className="w-[23px] h-[23px]" /> // ❌

// Don't forget aria-label on standalone icons
<button>
  <Icon icon={XIcon} size="lg" /> // ❌ Missing aria-label
</button>

// Don't use hardcoded colors
<Icon icon={TrendingUpIcon} style={{ color: '#7ED957' }} /> // ❌

// Don't use wrong size for context
<Icon icon={MessageCircleIcon} size="2xl" /> // ❌ Too large for button
```

### Accessibility Requirements

- **Decorative icons:** Must have `aria-hidden="true"` (default)
- **Standalone icon buttons:** Must have `aria-label` and `decorative={false}`
- **Touch targets:** Icon buttons must be 44×44px minimum
- **Color contrast:** Icons must meet WCAG AA contrast requirements (3:1 minimum)

### TypeScript Support

```tsx
import { Icon, type IconProps, type IconSize } from '@/components/ui/icon'
import { type LucideIcon } from 'lucide-react'

// Using IconProps
const MyIconComponent: React.FC<IconProps> = (props) => {
  return <Icon {...props} />
}

// Custom component with icon prop
interface CustomProps {
  icon: LucideIcon
  size?: IconSize
}

const CustomComponent: React.FC<CustomProps> = ({ icon, size = "md" }) => {
  return <Icon icon={icon} size={size} />
}
```

---

## Jellybeat Mascot

**Purpose:** Friendly, approachable branding with semantic color states
**File Format:** 600×600px PNG with transparency
**Location:** `.design-system/assets-mascot/` (source) and `/images/` (public)

### Color Variants & Semantic Meanings

Jellybeat comes in 4 color variants, each with specific semantic use cases:

| Variant | Filename | Semantic Meaning | Use Cases | Examples |
|---------|----------|------------------|-----------|----------|
| **Rainbow** 🌈 | `jellybeat-rainbow-full.png` | Default/Primary | Main branding, navigation, favicon | Logo, desktop nav, login page, chat avatar |
| **Green** 💚 | `jellybeat-green-full.png` | Success/Positive | Completion, achievements, positive feedback | Success messages, celebration screens |
| **Amber** 💛 | `jellybeat-amber-full.png` | Loading/Caution | Processing states, warnings | Loading screens, cautionary notices |
| **Red** ❤️ | `jellybeat-red-full.png` | Error/Alert | Error states, critical warnings | 404 page, error boundaries, alerts |

### Asset Specifications

- **Dimensions:** 600×600px square
- **Format:** PNG with alpha channel (transparency)
- **File Size:** ~400-410KB each
- **Compression:** Optimized for web
- **Aspect Ratio:** 1:1 (square)

### Using the Logo Component

The `Logo` component provides a flexible, type-safe way to use Jellybeat throughout the app.

#### Component API

```tsx
import Logo from '@/components/Logo'

type JellybeatVariant = "rainbow" | "green" | "amber" | "red"
type LogoVariant = "icon" | "horizontal"
type LogoSize = "sm" | "md" | "lg" | "xl"

interface LogoProps {
  variant?: LogoVariant          // "icon" or "horizontal" (default)
  jellybeatVariant?: JellybeatVariant  // Color variant (default: "rainbow")
  size?: LogoSize                // Size preset (default: "md")
  className?: string             // Additional Tailwind classes
}
```

#### Basic Usage

```tsx
// Default: horizontal lockup with rainbow Jellybeat (40px)
<Logo />

// Icon only
<Logo variant="icon" />

// Different sizes
<Logo size="sm" />  // 32px
<Logo size="md" />  // 40px (default)
<Logo size="lg" />  // 48px
<Logo size="xl" />  // 64px
```

#### Semantic State Examples

```tsx
// Success state (green)
<Logo jellybeatVariant="green" variant="icon" size="xl" />

// Loading state (amber)
<Logo jellybeatVariant="amber" variant="icon" size="lg" />

// Error state (red)
<Logo jellybeatVariant="red" variant="icon" size="xl" />

// Primary branding (rainbow)
<Logo jellybeatVariant="rainbow" variant="horizontal" size="md" />
```

#### Real-World Examples

```tsx
// Desktop navigation
<Logo variant="horizontal" size="md" />

// Mobile bottom nav
<Logo variant="icon" size="sm" />

// Chat AI avatar
<Logo variant="icon" jellybeatVariant="rainbow" size="md" />

// Loading screen
<div className="flex flex-col items-center gap-4">
  <Logo variant="icon" jellybeatVariant="amber" size="xl" />
  <p className="text-gray-600">Loading your dashboard...</p>
</div>

// 404 page
<div className="flex flex-col items-center gap-4">
  <Logo variant="icon" jellybeatVariant="red" size="xl" />
  <h1 className="text-h1">Page Not Found</h1>
</div>
```

### Direct Image Usage

For custom implementations outside the Logo component:

```tsx
import Image from 'next/image'

// Direct Next.js Image component usage
<Image
  src="/images/jellybeat-rainbow-full.png"
  alt="Jellybeat mascot"
  width={48}
  height={48}
  quality={100}
  priority
  className="object-contain"
/>
```

#### Asset Paths

- **Source files:** `.design-system/assets-mascot/jellybeat-{color}-full.png`
- **Public files:** `/images/jellybeat-{color}-full.png`
- **Available colors:** `rainbow`, `green`, `amber`, `red`

### Size Guidelines

| Size Preset | Pixel Size | Use Case |
|-------------|------------|----------|
| `sm` | 32×32px | Compact UI, mobile bottom nav |
| `md` | 40×40px | Default, chat avatars, icons |
| `lg` | 48×48px | Prominent branding, headers |
| `xl` | 64×64px | Hero sections, error states |

### Image Optimization

The Logo component uses Next.js Image with optimization settings:
- **quality={100}** - Maximum quality to prevent blurriness
- **priority** - Preloads for above-the-fold usage
- **Explicit width/height** - Prevents layout shift
- **object-contain** - Preserves aspect ratio

### Best Practices

#### ✅ DO
- Use rainbow variant for primary branding
- Use semantic colors to communicate state (green=success, amber=loading, red=error)
- Use the Logo component for consistent rendering
- Specify explicit sizes for better performance
- Use `variant="icon"` for compact layouts
- Use `quality={100}` when using Next.js Image directly

#### ❌ DON'T
- Don't use red Jellybeat for positive messages
- Don't use green Jellybeat for errors
- Don't mix color meanings (e.g., amber for success)
- Don't scale beyond 64px without re-optimization
- Don't use low quality settings (causes blurriness)
- Don't use CSS background-image (prevents optimization)

### Accessibility

- **Alt text:** Always provide descriptive alt text
  - Default: "Jellybeat mascot"
  - Context-specific: "Loading", "Error", "Success", etc.
- **Focus states:** Logo component inherits focus styles when interactive
- **Color contrast:** All variants meet WCAG AA contrast requirements
- **Screen readers:** Semantic meaning conveyed through surrounding context

### Component Implementation Reference

See `/components/Logo.tsx` for full implementation details:
- Type-safe variant props
- Responsive sizing logic
- Next.js Image optimization
- Horizontal lockup with branding text
- Icon-only variant for compact layouts

---

## Component Architecture

### Technology Stack

**Radix UI + Class Variance Authority (CVA) + Lucide Icons**

#### Why Radix UI?
- Unstyled, accessible components (headless UI)
- WCAG compliance built-in (ARIA attributes, keyboard navigation, focus management)
- Complex interactions solved (modals, dropdowns, tooltips with proper positioning)
- Used by: Vercel, Linear, Supabase, GitHub
- Perfect for applying iOS 18 styling while keeping accessibility

#### Why Class Variance Authority (CVA)?
- Type-safe component variants
- Clean API for multiple variants (variant, size, etc.)
- Replaces messy conditional class strings
- Integrates perfectly with Tailwind CSS

### Component Pattern

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Define variants with CVA
const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-body font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blurple focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-blurple text-white hover:bg-blurple/90",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        outline: "border-2 border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
        link: "text-blurple underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-subhead",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 2. TypeScript types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// 3. Component with forwardRef
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Radix Components to Use

| Component | Use Case | Priority |
|-----------|----------|----------|
| Dialog | Modals, sheets | High |
| DropdownMenu | Navigation menus, actions | High |
| Select | Form dropdowns | High |
| Slot | Polymorphic components | High |
| Tooltip | Info popovers | Medium |
| Popover | Rich content popovers | Medium |
| Tabs | Dashboard sections | Medium |
| Accordion | Expandable sections | Medium |
| Switch | Settings toggles | Low |
| RadioGroup | Form selections | Low |

---

## Component Specifications

### Button

**Built with:** CVA variants + Radix Slot

#### Usage
```tsx
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

// Primary button
<Button variant="default">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// With icon
<Button variant="default">
  <Send className="w-4 h-4" />
  Send Message
</Button>

// Icon only
<Button variant="ghost" size="icon" aria-label="Close">
  <X className="w-5 h-5" />
</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

#### Specifications
- **Min height:** 44px (default), 36px (sm), 52px (lg)
- **Min width:** 44px (touch target)
- **Border radius:** 12px (default), 8px (sm), 12px (lg)
- **Font weight:** 600 (semibold) - matches badge weight
- **Transition:** all 250ms
- **Active state:** scale(0.98)
- **Disabled state:** opacity 50%
- **Focus ring:** 2px blurple, 2px offset
- **Small size:** Uses variant styling (not hardcoded colors) for proper toggle button support

---

### Card

**Built with:** Standard HTML + Tailwind

#### Usage
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Specifications
- **Background:** white
- **Border:** 1px gray-200
- **Border radius:** 20px
- **Padding:** 24px
- **Shadow:** 0 2px 8px rgba(0, 0, 0, 0.06)
- **Interactive cards:** Add hover shadow + scale(0.98)

---

### Input

**Built with:** Styled input + Tailwind

#### Usage
```tsx
import { Input } from '@/components/ui/input'

<Input
  type="text"
  placeholder="Enter text..."
/>

<Input
  type="email"
  placeholder="Email address"
  disabled
/>
```

#### Specifications
- **Height:** 48px minimum
- **Border radius:** 12px
- **Background:** gray-50, white on focus
- **Border:** 1px gray-200
- **Padding:** 16px (horizontal), 12px (vertical)
- **Font size:** 17px (body)
- **Focus:** 2px blurple ring, 2px offset

---

### Badge

**Built with:** CVA variants

**Design Philosophy:** All badges use outline style (border + transparent background) except for small size which uses filled style with white text.

#### Usage
```tsx
import { Badge } from '@/components/ui/badge'

// Default badge (blurple outline)
<Badge variant="default">Default</Badge>

// Secondary badge (gray outline)
<Badge variant="secondary">Secondary</Badge>

// Success badge (green outline)
<Badge variant="success">Success</Badge>

// Warning badge (amber outline)
<Badge variant="warning">Warning</Badge>

// Destructive badge (red outline)
<Badge variant="destructive">Alert</Badge>

// Outline badge (light gray outline)
<Badge variant="outline">Outline</Badge>

// Small size (filled with white text)
<Badge size="sm">Small</Badge>
```

#### Variants
- **default:** Blurple border, blurple text, transparent bg
- **secondary:** Dark gray (gray-700) border and text, transparent bg
- **success:** Safe green border and text, transparent bg
- **warning:** Caution amber border and text, transparent bg
- **destructive:** Alert red border and text, transparent bg
- **outline:** Dark gray (gray-700) border and text, transparent bg

#### Specifications
- **Padding:** 10px horizontal, 2px vertical (default), 8px/2px (sm)
- **Border radius:** 8px
- **Border width:** 2px (all variants)
- **Font size:** 13px footnote (default), 11px (sm)
- **Font weight:** 600 (semibold)
- **Text wrapping:** Never wraps (whitespace-nowrap) - badge text always stays on one line

#### Size Exception
- **sm size:** Filled style with bg-blurple, text-white, no border (exception to outline rule)

---

### ChatBubble (iOS iMessage Style)

**Built with:** Custom component
**Key Feature:** One sharp corner closest to sender (20px rounded, one 4px sharp corner)

#### Usage
```tsx
import { ChatBubble } from '@/components/ui/chat-bubble'

// AI message (left-aligned)
<ChatBubble
  variant="ai"
  message="Hi! How can I help you today?"
  timestamp="2:30 PM"
  avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=kindnet"
/>

// Parent message (right-aligned)
<ChatBubble
  variant="parent"
  message="I'd like to know how Jamie is doing online."
  timestamp="2:31 PM"
/>
```

#### Specifications - AI Message
- **Background:** #F2F2F7 (gray-100)
- **Text color:** #1C1C1E (gray-900)
- **Border radius:** 20px with 4px sharp corner on top-left
- **Padding:** 16px horizontal, 14px vertical (mobile), 20px/14px (desktop)
- **Max width:** 80% (mobile), 75% (desktop)
- **Avatar:** 36px (mobile), 40px (desktop), circular with subtle shadow
- **Timestamp:** 13px, gray-500, below bubble with 8px top margin

#### Specifications - Parent Message
- **Background:** #6B7FFF (blurple)
- **Text color:** white
- **Border radius:** 20px with 4px sharp corner on top-right
- **Same padding/sizing as AI message**
- **No avatar**
- **Right-aligned**

**Important:** Use inline styles for mixed border-radius (Tailwind can't do this):
```tsx
style={{
  borderRadius: '20px',
  borderTopLeftRadius: '4px',  // or borderTopRightRadius for parent
}}
```

---

### Metric Badge (Circular)

**Built with:** Lucide icons + custom styling

#### Usage
```tsx
import { TrendingUp, Minus, TrendingDown } from 'lucide-react'

// Positive metric
<div className="flex flex-col items-center gap-3">
  <div
    className="w-16 h-16 rounded-full bg-safe flex items-center justify-center"
    style={{ boxShadow: '0 2px 8px rgba(126, 217, 87, 0.25)' }}
  >
    <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
  </div>
  <div className="flex flex-col items-center gap-0.5">
    <div className="text-[32px] leading-none text-gray-900 font-semibold">68</div>
    <div className="text-footnote text-gray-600 mt-1">Positive</div>
    <div className="text-footnote text-safe font-semibold mt-1">↑ +13</div>
  </div>
</div>
```

#### Specifications
- **Circle size:** 56px (mobile), 64px (desktop)
- **Icon size:** 28px (mobile), 32px (desktop)
- **Icon stroke:** 2.5px (bolder than default)
- **Number size:** 28px (mobile), 32px (desktop)
- **Label size:** 13px (footnote)
- **Shadow:** Colored, subtle (0 2px 8px with color alpha)

---

## Coding Standards

### File Structure

```
project-root/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── parent/                  # Parent routes
│   │   ├── page.tsx             # Chat interface
│   │   ├── insights/page.tsx    # Insights
│   │   └── patterns/page.tsx    # Patterns
│   └── globals.css              # Global styles + Tailwind
│
├── components/                   # Reusable components
│   ├── ui/                      # Design system primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── chat-bubble.tsx
│   ├── Navigation.tsx           # Feature components
│   ├── ParentChatPanel.tsx
│   └── ThemeTrendsGraph.tsx
│
├── lib/                         # Utilities
│   ├── utils.ts                 # cn() utility
│   └── constants.ts
│
├── types/                       # TypeScript types
│   └── index.ts
│
├── public/                      # Static assets
│   └── images/
│
├── .design-system/              # Design system docs
│   └── design-system.md         # This file
│
├── tailwind.config.mjs          # Design tokens
├── tsconfig.json
└── package.json
```

### File Naming

```
PascalCase.tsx              // React components
use-kebab-case.ts          // Hooks
kebab-case.utils.ts        // Utilities
page.tsx                   // Next.js routes
layout.tsx                 // Next.js layouts
```

### Component Template

```tsx
// components/ui/ComponentName.tsx

import * as React from 'react'
import { cn } from '@/lib/utils'

// 1. TYPES
interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
  // Add props
}

// 2. COMPONENT
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === 'default' && "default-variant-styles",
          variant === 'secondary' && "secondary-variant-styles",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// 3. DISPLAY NAME
ComponentName.displayName = 'ComponentName'
```

### TypeScript Standards

```tsx
// ❌ BAD - No types
const handleClick = (data) => {
  console.log(data)
}

// ✅ GOOD - Explicit types
const handleClick = (data: MessageData): void => {
  console.log(data)
}

// ❌ BAD - Using 'any'
const processData = (data: any) => {}

// ✅ GOOD - Proper types
const processData = (data: MessageData[]) => {}

// Define interfaces for objects
interface MetricData {
  positive: number
  negative: number
  neutral: number
}
```

### Tailwind CSS Best Practices

```tsx
// ❌ BAD - Hardcoded values
<div style={{ color: '#6B7FFF', padding: '24px' }}>

// ✅ GOOD - Use design tokens
<div className="text-blurple p-6">

// ✅ GOOD - Use cn() for conditional classes
<button
  className={cn(
    "base-styles",
    variant === 'primary' && "bg-blurple text-white",
    isDisabled && "opacity-40 cursor-not-allowed"
  )}
>
```

### React Best Practices

```tsx
// Always use functional components
export const ChatBubble = ({ message, sender }: ChatBubbleProps) => {
  return <div>{message}</div>
}

// Provide keys for lists
{messages.map((message) => (
  <ChatBubble
    key={message.id}  // Unique, stable key
    message={message}
  />
))}

// Extract complex logic to hooks
export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    // Logic...
  }

  return { messages, isLoading, sendMessage }
}
```

### State Management

```tsx
// Local state (useState)
const [isOpen, setIsOpen] = useState(false)
const [inputValue, setInputValue] = useState('')

// Form state (controlled components)
const [formData, setFormData] = useState({
  name: '',
  email: ''
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }))
}

// Don't mutate state directly
// ❌ BAD
items.push(newItem)
setItems(items)

// ✅ GOOD
setItems([...items, newItem])
```

---

## Accessibility

### Requirements

All components must include:
1. **Semantic HTML** - Use proper elements (`<button>`, `<nav>`, `<main>`)
2. **ARIA labels** - Descriptive labels for screen readers
3. **Keyboard navigation** - Tab order, Enter/Space activation
4. **Focus indicators** - Visible focus rings (never `outline: none` without replacement)
5. **Color contrast** - WCAG AA minimum (4.5:1 for text)
6. **Touch targets** - Minimum 44×44px for all interactive elements

### Minimum Touch Targets
- **Buttons:** 44×44px (iOS HIG requirement)
- **Inputs:** 48px height minimum
- **Links:** 44×44px tap area (use padding if needed)

### Color Contrast (WCAG AA)
- **Normal text:** 4.5:1 minimum
- **Large text (18pt+):** 3:1 minimum
- **UI components:** 3:1 minimum

### Focus States
```tsx
// ✅ GOOD - Visible focus ring
className="focus:outline-2 focus:outline-blurple focus:outline-offset-2"

// Never do this without replacement
className="focus:outline-none"  // ❌ Only if you add custom focus
```

### ARIA Labels
```tsx
// Icon-only buttons
<button aria-label="Close modal">
  <X />
</button>

// Screen reader only text
<span className="sr-only">Send message</span>
<svg aria-hidden="true">
  {/* Icon */}
</svg>
```

### Keyboard Navigation
```tsx
// All interactive elements must be keyboard accessible
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
```

---

## Responsive Patterns

### Mobile-First Approach

```tsx
// Stack on mobile, row on tablet+
<div className="flex flex-col md:flex-row gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

// Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block lg:hidden">Mobile only</div>

// Responsive sizing
<div className="text-subhead md:text-body lg:text-callout">
  Responsive text
</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## Common Pitfalls to Avoid

### ❌ Don't Bypass Design System
```tsx
// ❌ BAD
<div style={{ color: '#6B7FFF', padding: '24px' }}>

// ✅ GOOD
<div className="text-blurple p-6">
```

### ❌ Don't Use Index as Key
```tsx
// ❌ BAD
{items.map((item, index) => <Item key={index} />)}

// ✅ GOOD
{items.map((item) => <Item key={item.id} />)}
```

### ❌ Don't Mutate State Directly
```tsx
// ❌ BAD
items.push(newItem)
setItems(items)

// ✅ GOOD
setItems([...items, newItem])
```

### ❌ Don't Forget Loading States
```tsx
// ❌ BAD
const data = await fetchData()

// ✅ GOOD
const [isLoading, setIsLoading] = useState(false)
setIsLoading(true)
const data = await fetchData()
setIsLoading(false)
```

---

## Component Checklist

Before marking a component "done", verify:

### Design
- [ ] Matches iOS 18 aesthetic (flat, minimal shadows)
- [ ] Uses design tokens from Tailwind config
- [ ] Responsive (mobile-first)
- [ ] Proper spacing and alignment

### Code Quality
- [ ] TypeScript types defined (no `any`)
- [ ] Proper error handling
- [ ] No hardcoded values
- [ ] Uses cn() utility for class merging
- [ ] forwardRef for ref support

### Accessibility
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets 44×44px minimum

### Testing
- [ ] Tested on mobile viewport (393px)
- [ ] Tested on desktop
- [ ] Keyboard navigation tested
- [ ] No console errors
- [ ] Works with screen reader

---

## Quick Reference

### Most Common Patterns

```tsx
// Button with icon
<Button variant="default">
  <Send className="w-4 h-4" />
  Send Message
</Button>

// Card with header
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>

// Chat bubble
<ChatBubble
  variant="ai"
  message="Hello!"
  timestamp="2:30 PM"
  avatarUrl="..."
/>

// Metric badge
<div className="w-16 h-16 rounded-full bg-safe flex items-center justify-center">
  <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
</div>

// Responsive layout
<div className="flex flex-col md:flex-row gap-4 md:gap-6">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## Resources

### External
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Internal
- Tailwind Config: `tailwind.config.mjs`
- Component Library: `components/ui/`
- Utilities: `lib/utils.ts`

---

## Need Help?

1. **Quick patterns:** Check Quick Reference section above
2. **Component specs:** Search this document for component name
3. **Code examples:** Check existing components in `components/ui/`
4. **Ask the team:** Discord or WhatsApp

---

**Built with ❤️ by MLTPY for the KindNet Hackathon**

*Last updated: December 2024*
