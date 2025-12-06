PR #2 — Summary of changes and reviewer notes

Overview

This file summarises the key additions included in PR #2 and provides quick reviewer notes and local run instructions.

What PR #2 adds

- A new Next.js 14 prototype app under `web/`:
  - App pages and routes: `web/app/`
  - UI components: `web/components/` and `web/components/ui/`
  - Mock APIs (file-based): `web/app/api/` (e.g., `login`, `parent/summary`)
  - Mock data: `web/data/users.json`, `web/data/words.json`
  - Design system doc: `web/.design-system/design-system.md`
  - Examples / demo pages: `web/app/components-demo`, `web/app/test` etc.

- Product/spec document: `AI Safety Guide for Children.md` (comprehensive spec)

Why this matters

- The `web/` prototype contains a parent dashboard, component library, and several visualisations meant to demonstrate the product direction "Digital Guardian".
- It is a local/demo-first implementation (file-based mock data, simplified auth), intended for UI and UX review.

Quick local run instructions (web prototype)

1. cd into the web app:
   ```bash
   cd web
   ```
2. Install node deps:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

Demo accounts (local JSON):

- `parent_01` / `1234`  (parent)
- `kid_01` / `abcd`     (child)
- `kid_02` / `efgh`     (child)

Reviewer notes / items to consider

- Mock data contains offensive terms: `web/data/words.json` includes example words for UI testing. This is expected for a demo, but note it in docs and remove or sanitize before any public sharing.
- Authentication is intentionally simplified (file-based). For any integration tests or production work, replace with proper session cookies and secure storage.
- The design system is extensive and mostly self-contained in `web/.design-system/design-system.md` — good for frontend consistency.
- Some components use inline styles for mixed border radius (design requirement). This is acceptable in the prototype but could be refactored to utility classes or small helper styles if desired.
- The Next.js app references modern versions (Next 14, React 18) in `web/package.json` — check compatibility with your local Node version.

Suggested documentation updates (I can apply these if you want):

- Update top-level `README.md` to mention the `web/` app and how to run it (I attempted to patch this but created this summary as a safe incremental step).
- Add `CHANGELOG.md` or `PR-2-SUMMARY.md` (this file) to the repo root for reviewer-level context.
- Add a short note in `web/README.md` pointing to the design system and demo creds (it already exists but I can expand it).

Next steps I can take now (pick one):

1. Patch the top-level `README.md` to the updated content I prepared and commit it.
2. Expand `web/README.md` with explicit setup notes for macOS/fish shell and required Node version.
3. Run the Next.js dev server locally here and report any runtime errors.
4. Create a small `CHANGELOG.md` listing files added by PR #2.

Tell me which of the above you'd like me to do next, and I will proceed.
