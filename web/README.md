## Digital Guardian Web MVP

This is a small Next.js + TypeScript prototype of the **Digital Guardian** parent dashboard, based on the _AI Safety Guide for Children_ spec.

### What’s included

- **Tech stack**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS.
- **Local “DB”**: file‑based mock data in `data/users.json` and `data/words.json`.
- **APIs**:
  - `POST /api/login` – validates a fake username/password against `data/users.json`.
  - `GET /api/parent/summary` – returns a static JSON summary of weekly patterns.
- **Parent dashboard UI**:
  - Welcome header with trust‑based messaging.
  - Summary cards for kindness, risk moments, privacy, and wellbeing.
  - Streamlit‑inspired sections:
    - **Chat panel** (“Ask the Digital Guardian”) – ready for ML integration.
    - **Topics / words panel** – themes + example phrases for conversations.

### Running the app

```bash
cd web
npm install
npm run dev
```

Then open `http://localhost:3000` and click **“Log in as parent_01”** to reach the dashboard.

Demo credentials are stored in `data/users.json`:

- Username: `parent_01`
- Password: `1234`


