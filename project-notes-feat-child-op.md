# KindNet / Digital Guardian – Project Notes (feat-child-op)

## High-Level Architecture

- **Top-level app:**
  - Original prototype: **Streamlit** app (`app.py`) with `login.py` and `pages/parent_page.py` / `pages/child_page.py`.
  - Newer parent experience: **Next.js 14 + TypeScript** web app under `web/` called **KindNet**.
  - **Backend ML service:** Python FastAPI app under `backend/` that analyzes messages for safety (toxicity, bullying, etc.).

- **Three main parts now co-exist:**
  1. **Streamlit UI (legacy prototype)** – simple parent/child dashboards using `users.json` + `words.json` at repo root.
  2. **KindNet Web (Next.js)** – parent-facing dashboard only (chat, insights, patterns) using `web/data/users.json` + `web/data/words.json`.
  3. **Backend ML engine (`backend/`)** – Kid Message Safety & Communication Coach with FastAPI, Hugging Face LLM integration, and rich classification pipeline.

---

## 1. Streamlit App – Parent & Child Flows (Current Child UI)

**Location:** root-level Streamlit app

- `app.py`
  - Entry point: simply imports and runs `login()` from `login.py`.

- `login.py`
  - Reads `users.json` (root) as the **auth source**.
  - UI:
    - Radio: `Parent` / `Child` role.
    - Username + password fields.
    - On successful login:
      - If role = `parent` → `st.switch_page("pages/parent_page.py")`.
      - If role = `child` → `st.switch_page("pages/child_page.py")`.

- `users.json` (root)
  - File-based "DB" of demo accounts:
  - `parent_01` / `1234` → role `parent`, name `Alex`.
  - `kid_01` / `abcd` → role `child`, name `Jamie`.
  - `kid_02` / `efgh` → role `child`, name `Emma`.

- `words.json` (root)
  - Stores lists of concerning words/phrases per child ID, e.g.:
    - `kid_01`: `['fuck', 'sex', 'ugly']`
    - `kid_02`: `['fat', 'fight']`
  - Used as mock "risky words" data for the parent dashboard.

- `pages/parent_page.py`
  - **Guards:** Only accessible if `st.session_state["role"] == "parent"`.
  - **Sections:**
    - Log out button (clears `st.session_state`).
    - Simple **chatbot-like panel**: stores messages in `st.session_state.messages` but currently **no real AI** – only echoes user messages as "You:" with no bot replies.
    - **Topics of Discussion** select box: static list (`"New words"`, `"How to educate kids"`, etc.).
    - **List of words:** loads `words.json`; lets parent pick a child and see their word list.
  - This is the parent view of the **Streamlit** version, not the Next.js KindNet.

- `pages/child_page.py`
  - Currently a placeholder:
    - `st.title("Child Page")` only.
  - This is the place where a future **child-facing experience** in Streamlit could live (e.g., mascot, text box, feedback, etc.).

- **Top-level README (`README.md`)**
  - Describes this Streamlit setup only (older doc):
    - How to run: `pip install -r requirements.txt` → `streamlit run app.py`.
    - Mentions `users.json`, `words.json`, `login.py`, parent and child pages.

**Takeaway for "child part" of the project:**
- The **child experience is currently almost empty** (just a title on `child_page.py`).
- Parent Streamlit dashboard is minimal: simple chat log + word list view; no real ML integration here.
- Authentication + child identity and "risky words" are all driven by the root-level JSON files.

---

## 2. Backend ML Engine – Kid Message Safety System

**Location:** `backend/`

- Described in `backend/README.md` as:
  - **"Kid Message Safety & Communication Coach"** – helps kids rephrase harmful messages rather than blocking them.
  - Uses **Hugging Face LLM** for feedback and local ML models for classification.

### 2.1 Capabilities

- **Classification levels:** GREEN, YELLOW, RED
  - GREEN – safe, constructive.
  - YELLOW – dismissive / mild criticism.
  - RED – profanity, threats, attacks.

- **Detections (via analyzers):**
  - Profanity / toxicity (`toxicity.py`).
  - Harsh criticism, exclusion language, dismissive tone, threats, hate speech, violence, self-harm, etc. (`patterns.py`).
  - Emotions & intents (`models.py`, `EmotionType`, `IntentType`).

- **Feedback:**
  - `feedback/` package + Hugging Face LLM via `hf_llm_generator.py`.
  - Generates age-appropriate messages and alternative phrasings.

### 2.2 Entry Points

- `backend/main.py`
  - `python main.py` → interactive CLI test.
  - `python main.py --demo` → prints demo classifications & feedback.
  - `python main.py --api` → starts **FastAPI** server.

- `backend/src/api/app.py`
  - FastAPI app with endpoints:
    - `GET /` – root info.
    - `GET /health` – health check.
    - `POST /analyze` – full analysis (classification + feedback, etc.).
    - `POST /classify` – quick classification only.
    - `GET /examples` – lists example messages.
    - `POST /batch` – batch analysis.
    - settings endpoints for age range, etc.
  - `MessageProcessor` instance stored as global `_processor` and initialized in `lifespan()` using env vars (`HF_API_KEY`, `HF_MODEL_ID`).

- `backend/examples/`
  - `basic_usage.py` – local demo using `MessageProcessor` directly (no API).
  - `api_demo.py` – shows how to call the REST API via `requests`.

- `backend/TESTING.md`
  - How to run tests (`pytest`), quickly verify endpoints, and a sample health-check script.

### 2.3 Core Pipeline

- `backend/src/pipeline.py` → `MessageProcessor`
  - Preprocesses text.
  - Runs analyzers (toxicity, patterns, emotion, etc.).
  - Uses `DecisionEngine` to assign GREEN/YELLOW/RED.
  - Calls `FeedbackGenerator` (Hugging Face LLM or templates) for non-GREEN.
  - Uses `ResponseCache` for caching repeated messages.
  - Returns `ProcessingResult` with:
    - `classification` (GREEN/YELLOW/RED)
    - `analysis` (toxicity, patterns, issues, intent)
    - `feedback` (if needed)
    - `metadata` (timing, cache hit, etc.).

**Takeaway for "child part":**
- Backend already knows how to **analyze a child’s message** and propose better phrasing.
- Currently it is primarily CLI/API-based, **not yet wired into either Streamlit child UI or KindNet web**.

---

## 3. KindNet Web App – Parent Dashboard (Next.js)

**Location:** `web/`

- `web/README.md` describes this as the **KindNet parent dashboard** prototype:
  - Next.js 14 + React 18 + TypeScript.
  - Tailwind-based iOS 18 design system.
  - File-based mock data in `web/data/users.json` + `web/data/words.json`.
  - Key routes:
    - `/` – login/landing page.
    - `/parent` – chat interface.
    - `/parent/insights` – weekly insights (summary, graph, calendar).
    - `/parent/patterns` – patterns & data (stats + "conversation starters").

### 3.1 Data & Mock Auth

- `web/data/users.json` (separate from root one):
  - Same idea: `parent_01` (parent), `kid_01` (Jamie), `kid_02` (Emma).
- `web/data/words.json`:
  - Same mock "risky words" lists as root-level `words.json`.
- `web/app/api/login/route.ts`:
  - Reads `web/data/users.json` and validates username/password on POST `/api/login`.
  - Returns `{ ok, user: { username, role, name } }` (no cookies yet).
- `web/app/api/parent/summary/route.ts`:
  - Returns static summary + theme data for the parent.
  - Hard-coded for `parent_01` with children `kid_01` (Jamie) & `kid_02` (Emma).

### 3.2 Parent-Facing Pages

- `web/app/page.tsx` (Home/Login)
  - Landing view that visually mimics iOS 18 with a card-based login.
  - Form posts to `/api/login` but also has a **direct login button** to `/parent` using hardcoded demo account.
  - Explains that auth is file-based and a demo.

- `web/app/parent/page.tsx` (Chat)
  - Uses `ResponsiveLayout` + `ParentDashboard`.
  - Hardcodes `parentId = "parent_01"`.
  - `ParentDashboard` wraps `ParentChatPanel` full-height.

- `web/components/ParentChatPanel.tsx`
  - Full-screen chat UI styled like iMessage:
    - Uses `ChatBubble`, `Badge`, `Button` from UI kit.
    - Maintains `messages` state client-side.
    - Initial assistant message invites questions like *"How is Jamie doing online this week?"*.
    - When the parent sends a message, it appends a **placeholder AI response** saying the panel will be wired to ML later.
    - Left-hand "Previous chats" column (desktop); hidden on mobile.
  - **No real backend call yet**; perfect hook to call the ML backend later.

- `web/app/parent/insights/page.tsx`
  - Uses `ParentSummaryPanel`, `ThemeTrendsGraph`, `ActivityCalendar`.
  - Layout uses `ResponsiveLayout` with mobile header.
  - `ParentSummaryPanel`:
    - Shows weekly summary text.
    - Has toggle buttons for `kid_01` and `kid_02` and shows **four stat cards** for the selected child.
  - `ThemeTrendsGraph`:
    - Pure front-end graph with fake monthly data for Jamie/Emma.
    - Supports metric selection: positivity, kindness, privacy, wellbeing.
  - `ActivityCalendar`:
    - Calendar card with day dots (excellent/good/needs-attention) using mock data.

- `web/app/parent/patterns/page.tsx`
  - Shows **stats summary cards** (Kind Interactions, Privacy Warnings, etc.).
  - Renders `ParentWordsPanel` (themes + risky phrases badges for first child).

- `Navigation.tsx` + `MobileBottomNav.tsx`
  - Top nav for desktop, bottom nav for mobile.
  - Knows about `/parent`, `/parent/insights`, `/parent/patterns`.

### 3.3 Design System / Layout

- `web/components/ui/*` – button, card, badge, input, chat-bubble.
- `web/components/ResponsiveLayout.tsx` – shared layout for parent pages:
  - Mobile header.
  - Mobile bottom nav.
  - Handles padding so that the same components work on both mobile & desktop.
- `web/app/layout.tsx` – wraps pages in header/footer, uses `Navigation` for desktop.

**Takeaway for "child part":**
- The **KindNet web app is currently only parent-facing**:
  - No child login in the web app.
  - Child identities are implicit (Jamie/Emma) via mock data.
  - All views are parent dashboards and visualizations.

---

## 4. How These Pieces Fit Together Conceptually

- **Vision (AI Safety Guide for Children.md):**
  - Real-time, on-device guardian for children.
  - Pattern-based reporting to parents (no raw messages).
  - Parent dashboard with AI chat to explain patterns and suggest conversations.

- **Backend (`backend/`):**
  - Implements the **Guardian’s brain** – classification + feedback.
  - Ready to power both **child-side mascot** and **parent dashboards**.

- **Streamlit app (root):**
  - Early prototype for parent + child UI.
  - Currently used mainly as a quick demo; child view is almost empty.

- **KindNet web (`web/`):**
  - Modern parent dashboard aligned with the spec and design guidelines.
  - Currently not wired to the ML backend – everything is mock/static.

---

## 5. Notes Specifically for Future "Child" Work on feat-child-op

- **Branch context:** `feat-child-op` is created off `main` and currently has **no code changes yet**.
- **Potential directions for child work (not doing them yet, just understanding):**
  - **Option A (Streamlit child):**
    - Use `backend` API directly from `pages/child_page.py` to analyze text the child types.
    - Could show mascot-like feedback inside Streamlit (color state + feedback text).
  - **Option B (New web child app):**
    - Add a `/child` area under `web/app/` with a web-based child UI.
    - It could call the `backend` FastAPI via fetch or through a Next.js API route proxy.
  - **Identity & linkage:**
    - Child IDs / names already exist in `users.json` and `web/data/users.json`.
    - Any child UI needs to respect the **privacy & trust philosophy** (no spying, explain guidance).

- **Data sources to re-use when we implement child flows:**
  - `backend` classification & feedback (for live coaching).
  - `web/data/words.json` or an extended data structure for storing anonymized patterns.
  - `users.json` (root + web) for mapping parent ↔ children.

No code has been modified; this file is just internal notes to keep everything straight for future child-facing work on `feat-child-op`.
