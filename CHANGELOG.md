# Changelog

All notable changes to the KindNet project.

## Unreleased — Jellybeat mascot branding (branch: moody-agent-4-branding)

### Added
- Jellybeat mascot integration throughout the app
  - Rainbow Jellybeat as main mascot and favicon
  - Amber Jellybeat for loading states
  - Green Jellybeat for success states
  - Red Jellybeat for error/404 pages
- Logo component with icon and horizontal lockup variants
- LoadingState component with animated amber Jellybeat
- Custom 404 error page with red Jellybeat
- Favicon (rainbow Jellybeat) and metadata icons

### Changed
- Desktop navigation header now displays Logo with Jellybeat mascot
- Login page features centered Logo component
- Chat AI avatar updated from dicebear API to rainbow Jellybeat
- Brand identity unified with Jellybeat across all touchpoints

### Technical Details
- Logo variants: icon-only and horizontal lockup (mascot + KindNet wordmark)
- Mascot assets: 4 color variants stored in `/public/images/`
- Responsive sizing: sm (32px), md (40px), lg (48px), xl (64px)
- Accessible: proper alt text, aria-labels, semantic HTML

## Unreleased — Mobile-first responsive layout (branch: moody-agent-1-layout)

### Added
- Mobile bottom navigation bar (iOS-style tab bar with 4 tabs)
- Mobile header component with back button support
- ResponsiveLayout wrapper component for consistent mobile/desktop layouts
- Touch-friendly UI elements (44px+ touch targets throughout)

### Changed
- Refactored all pages to mobile-first responsive design (iPhone 14/15 Pro baseline: 393px)
- Updated login page to use iOS 18 design system (blurple theme, light backgrounds)
- Modified root layout to hide desktop header on mobile
- Adapted parent chat page to hide sidebar on mobile
- Updated insights and patterns pages with mobile-first grid layouts

### Technical Details
- Breakpoints: mobile-first with sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px
- Design tokens: blurple, safe, caution, alert colors
- Typography: iOS 18 scale (text-body, text-footnote, text-subhead)
- Accessibility: WCAG AA compliance, semantic HTML, ARIA labels
- No horizontal scrolling on mobile viewports

## PR #2 — Add Next.js prototype and product docs

### Added
- `web/` — full Next.js 14 prototype app
  - `web/app/` — pages and routes (login, parent dashboard, insights, patterns)
  - `web/components/` — UI components and panels
  - `web/components/ui/` — design-system primitives (Button, Card, Badge, Input, ChatBubble)
  - `web/app/api/` — mock API routes (`login`, `parent/summary`)
  - `web/data/` — mock data (`users.json`, `words.json`)
  - `web/.design-system/design-system.md` — comprehensive design system documentation
  - `web/README.md` — local web app README (short)
- `AI Safety Guide for Children.md` — product/spec and vision document
- `PR-2-SUMMARY.md` — reviewer summary (added during doc review)

### Notes
- The Next.js app is a demo/prototype and uses file-based mock data and simplified authentication.
- `web/data/words.json` intentionally contains example offensive words for UI testing; these are synthetic and should not be treated as real user data.

### Suggested follow-ups
- Replace file-based auth with session cookies and secure storage before any public deployment.
- Sanitize sensitive mock data prior to sharing externally.
- Decide whether to merge the full `web/` app into `main` as-is or refactor first for production safety.
