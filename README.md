# HERE — Student Wellbeing Self-Service Support Platform

> **ServiceNow Student Challenge: Track 4 — Self-Service Support Portal**  
> *"You don't have to figure it all out."*

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=flat&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat&logo=python)](https://python.org)
[![Scikit--Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-f7931e?style=flat&logo=scikitlearn)](https://scikit-learn.org)
[![FERPA Compliant](https://img.shields.io/badge/FERPA-Compliant%20Privacy-8DCFA9?style=flat)](https://studentprivacy.ed.gov)

---

## 1. What HERE Is & Why It Exists

**HERE** is an intelligent, human-centered self-service support portal designed for university students navigating academic strain, burnout, sleep disturbance, financial friction, and mental wellbeing hurdles.

### The Problem
Universities routinely maintain 10 to 15 fragmented support silos:
- Academic Strategy & Tutoring
- Mental Health Counselling
- Financial Hardship & Emergency Grants
- Accessibility & Disability Accommodations
- Housing & International Student Services
- Student Legal Aid & Ombudsperson

When students feel overwhelmed, they are forced to navigate bureaucratic department directories, guess which service handles their multi-faceted issue, and repeatedly retell vulnerable, traumatic stories to different intake coordinators.

### The Solution: HERE
HERE serves as the **single, confidential front door** for the entire campus. It provides:
1. **Empathetic AI Discovery**: The student talks naturally. HERE listens without rushing to premature questionnaires or instant bookings.
2. **AI Mirror Reflection**: Synthesizes themes, impact, and duration into a concise reflection that the student can edit or confirm before any case is created.
3. **Independent ML Classification**: An explainable Scikit-Learn TF-IDF pipeline classifies intent into 9 university departments and categorizes triage urgency (*Green*, *Amber*, *Red*).
4. **Coordinated Multi-Department Routing**: Automatically links multiple departments into one unified case journey (e.g., Academic Support + Counselling) so the student never tells their story twice.
5. **Human-in-the-Loop Care**: Licensed counsellors receive a structured clinical intake briefing, accept cases, message students securely, and offer consultation slots.
6. **Signature "Waitlist Swap"**: Automatically matches cancellation openings to eligible students based on compatibility and waiting duration.
7. **Campus Pulse Operational Cockpit**: Department leadership monitors aggregated, anonymized trends (e.g., exam surges, sleep disruption) with zero FERPA privacy leaks.

---

## 2. Core Product Philosophy: Separation of Concerns

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     LLM      │     │      ML      │     │   BACKEND    │     │    HUMAN     │
│   "TALKS"    │ ──> │ "CLASSIFIES" │ ──> │    "ACTS"    │ ──> │  "SUPPORTS"  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

The system strictly follows this division:
- **LLM** (`LLMConversationEngine`): Handles conversational empathy, progressive inquiry, clarification, and human-readable summaries. It never blindly writes to databases or makes final routing decisions.
- **ML** (`ml/` pipeline): Sub-10ms Scikit-Learn TF-IDF classifier for structured intent classification and urgency scoring with explicit probability outputs.
- **BACKEND** (`backend/`): Enforces business rules, case creation, department allocation, appointment reservations, Waitlist Swap scoring, and notifications.
- **HUMAN** (Counsellors & Deans): Licensed professionals review student-approved clinical briefings, provide care, and make therapeutic decisions.

---

## 3. End-to-End System Architecture

```text
                              ┌────────────────────────────────────────┐
                              │             Student User               │
                              └────────────────────────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │        HERE Frontend (Vite/React)      │
                              │ Dark Cinematic UI · 3D Assistant Orb   │
                              └────────────────────────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │         Backend Express API            │
                              │    Authentication & Rate Limiting      │
                              └────────────────────────────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         ▼                                                 ▼
             ┌───────────────────────┐                         ┌───────────────────────┐
             │  Crisis Safety Layer  │                         │ LLM Discovery Engine  │
             │ Deterministic & N-gram│                         │ Multi-Stage Discovery │
             │   Crisis Interception │                         │    AI Mirror Summary  │
             └───────────────────────┘                         └───────────────────────┘
                         │ (if clear)                                      │
                         └────────────────────────┬────────────────────────┘
                                                  ▼
                               ┌─────────────────────────────────────┐
                               │  Separate ML Classification Layer   │
                               │  TF-IDF + Logistic Regression (ML)  │
                               │  9 Intent Classes · 3 Urgency Tiers │
                               └─────────────────────────────────────┘
                                                  │
                                                  ▼
                               ┌─────────────────────────────────────┐
                               │       Intelligent Router            │
                               │   Multi-Dept Coordinated Pathways   │
                               └─────────────────────────────────────┘
                                                  │
                                                  ▼
                               ┌─────────────────────────────────────┐
                               │      Persistent Database Layer      │
                               │ Cases · Appointments · Waitlist     │
                               └─────────────────────────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         ▼                                                 ▼
             ┌───────────────────────┐                         ┌───────────────────────┐
             │  Counsellor Sanctuary │                         │ Admin Operational Hub │
             │ Clinical Briefing     │                         │ Anonymized Trends     │
             │ Secure Response Chat  │                         │ Campus Pulse Cockpit  │
             └───────────────────────┘                         └───────────────────────┘
```

---

## 4. Project Structure

```text
/here
│
├── frontend/ (src/)
│   ├── components/            # UI components (AssistantOrb, ChatInterface, MyJourneyView, etc.)
│   ├── pages/                 # Full pages (HomePage, CounsellorPortalPage, AdminPortalPage, AuthPages, etc.)
│   ├── services/              # API clients, authService, conversationEngine, store
│   └── styles/                # CSS design system, typography, tokens
│
├── backend/
│   ├── server.js              # Express app entry point (Port 5000)
│   ├── routes/                # REST API routes (auth, chat, safety, cases, appointments, waitlist, counsellor, admin)
│   ├── services/
│   │   ├── llm/               # Replaceable LLM abstraction (Gemini / OpenAI / Anthropic)
│   │   ├── ml/                # mlClient.js bridging Node to Python ML pipeline
│   │   ├── safety/            # Continuous crisis interception layer
│   │   ├── routing/           # Multi-department routing engine
│   │   ├── appointments/      # Slot management & signature Waitlist Swap engine
│   │   ├── reports/           # Dual report generator (Student summary + Counsellor briefing)
│   │   └── notifications/     # Event-driven in-app notification dispatch
│   └── middleware/            # Auth, rate limiting, and CORS middleware
│
├── ml/                        # Independent Machine Learning Subsystem
│   ├── README.md              # Standalone study guide for ML models
│   ├── config.yaml            # Hyperparameters and path configurations
│   ├── requirements.txt       # Python dependencies (scikit-learn, pandas, joblib)
│   ├── data/
│   │   ├── raw/               # Raw corpus definitions
│   │   ├── processed/         # Tokenized, cleaned training sets
│   │   └── sample/            # 131-sample balanced synthetic student support dataset
│   ├── src/
│   │   ├── preprocessing.py   # Text normalizer, lowercasing, regex tokenization
│   │   ├── feature_engineering.py # Sublinear TF-IDF (1, 2) vectorization
│   │   ├── train_intent.py    # Multi-class Logistic Regression for 9 support departments
│   │   ├── train_urgency.py   # Logistic Regression for 3 triage urgency tiers
│   │   ├── evaluate.py        # Macro Precision/Recall/F1 benchmark suite
│   │   └── predict.py         # Sub-10ms CLI inference utility
│   └── models/
│       ├── intent_model/      # Serialized intent pipeline (.pkl)
│       └── urgency_model/     # Serialized urgency pipeline (.pkl)
│
├── database/
│   ├── schema/schema.json     # Formal JSON schema for 15 core entities
│   ├── seed/initialSeedData.json # Seeded demo users, departments, slots, cases
│   └── db.js                  # Persistent file-backed JSON database engine
│
├── docs/
│   ├── architecture.md        # Comprehensive technical architecture
│   ├── api.md                 # Full REST API specification
│   ├── ml.md                  # Machine learning methodology and benchmarks
│   └── demo.md                # 21-step evaluator walkthrough script
│
├── .env.example               # Safe environment variable template (No secrets)
├── package.json               # Full-stack dependencies and scripts
└── README.md                  # Master project documentation
```

---

## 5. Quick Start & Run Commands

### Prerequisites
- **Node.js**: v18.0+
- **Python**: v3.10+ with `pip`
- **npm**: v9.0+

### Step 1: Install Dependencies
```bash
# Install frontend and backend npm dependencies
npm install

# Install ML Python dependencies
cd ml
pip install -r requirements.txt
cd ..
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional)* Add your Gemini or OpenAI API key to `LLM_API_KEY` in `.env`. If left empty, HERE automatically operates using its built-in rule-based conversational discovery engine.

### Step 3: Run the Application
In separate terminal tabs:

**Terminal 1 (Backend API):**
```bash
npm run server
# Starts backend Express API on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 6. Demo Accounts & Credentials

HERE implements professional authentication where roles are determined **after** credential verification. No awkward public role dropdowns appear on the login page.

| Role | Email | Password | Intended Experience |
| :--- | :--- | :--- | :--- |
| **Student** | `student@here.demo` | `HEREdemo123` | Conversational discovery, AI Mirror, Pathway selection, My Journey |
| **Counsellor** | `counsellor@here.demo` | `HEREdemo123` | Sanctuary Cockpit, clinical briefing, case acceptance, messaging |
| **Admin** | `admin@here.demo` | `HEREdemo123` | Campus Pulse analytics, department workload, FERPA-safe trends |

*Tip: On `/login`, click any of the 3 quick-fill buttons (**Student**, **Counsellor**, **Admin**) to auto-fill credentials.*

---

## 7. How the LLM Works: "TALKS"

The LLM is responsible for empathetic conversation and language understanding without rushing to solutions.

### The 11-Stage Progressive Discovery Pipeline
1. **`OPEN`**: Warm, open-ended listening.
2. **`UNDERSTAND`**: Identifies whether the concern is academic, emotional, financial, or accommodation.
3. **`CLARIFY`**: Contextual follow-up (e.g., distinguishes workload volume vs. performance anxiety).
4. **`ASSESS_IMPACT`**: Checks everyday routines, cognitive focus, and restorative sleep.
5. **`ASSESS_DURATION`**: Gathers timeline (e.g., onset within 2 weeks vs. chronic).
6. **`ASSESS_URGENCY`**: Evaluates support priority without diagnostic labels.
7. **`SUMMARIZE`**: Formulates the **AI Mirror** summary.
8. **`CONFIRM`**: Asks *"Did I get that right?"* with *Yes*, *Not quite*, and *Edit* options.
9. **`RECOMMEND`**: Presents coordinated support pathways.
10. **`CONNECT`**: Matches appropriate counsellors and university departments.
11. **`SCHEDULE`**: Offers conversational booking slots.

### Provider Abstraction (`backend/services/llm/`)
The LLM engine is vendor-agnostic and supports:
- **Google Gemini** (`gemini-1.5-flash` / `gemini-1.5-pro`)
- **OpenAI** (`gpt-4o` / `gpt-4o-mini`)
- **Anthropic Claude** (`claude-3-5-sonnet`)
- **Deterministic Offline Fallback**: Guaranteed conversational discovery even when API keys are absent or rate-limited.

---

## 8. How the ML Layer Works: "CLASSIFIES"

The ML system lives in `/ml/` as an independent, transparent pipeline.

### Model Architecture
- **Vectorization**: Sublinear TF-IDF ($N=1, 2$, max_features=1500)
- **Classifier**: Multi-Class Logistic Regression with L2 regularization (`C=1.0`, `solver='lbfgs'`)
- **Inference Speed**: `< 8 milliseconds` per case.

### 9 Support Intent Classes
1. `ACADEMIC_SUPPORT`: Coursework, exams, tutoring, academic petitions.
2. `COUNSELLING_WELLBEING`: Anxiety, mood, burnout, sleep disturbance.
3. `FINANCIAL_ASSISTANCE`: Tuition fees, emergency bursaries, living stipends.
4. `STUDENT_AFFAIRS`: Extracurriculars, roommate disputes, conduct queries.
5. `HOUSING`: Dormitory accommodation, lease guidance, international settlement.
6. `ACCESSIBILITY`: ADHD modifications, physical exam accommodations.
7. `CAREER_SUPPORT`: Internship placements, CV review, interview prep.
8. `GENERAL_SUPPORT`: Multi-faceted orientation, university navigation.
9. `MULTI_SUPPORT`: Co-occurring needs requiring multi-department coordination.

### 3 Urgency Tiers
- **`GREEN`**: Standard guidance (routine turnaround 24–48 hours).
- **`AMBER`**: Escalating distress, sleep loss, or impending deadlines (12–24 hours).
- **`RED`**: High acute strain (same-day priority intervention).

### Evaluation Metrics
| Metric | Intent Classifier | Urgency Classifier |
| :--- | :--- | :--- |
| **Accuracy** | **83.97%** | **94.66%** |
| **Macro Precision** | **0.86** | **0.95** |
| **Macro Recall** | **0.84** | **0.94** |
| **Macro F1-Score** | **0.85** | **0.94** |

### How to Train and Evaluate the ML Models
```bash
# Train Intent Model
python ml/src/train_intent.py

# Train Urgency Model
python ml/src/train_urgency.py

# Run Full Evaluation Suite (Confusion matrix & Classification reports)
python ml/src/evaluate.py

# Test Standalone CLI Prediction
python ml/src/predict.py --text "I have three finals next week and I haven't slept in days"
```

---

## 9. How Intelligent Routing Works

The backend `routingEngine.js` combines:
1. **ML Intent Probabilities**
2. **ML Urgency Classification**
3. **Student-Confirmed Themes**
4. **Real-Time Department Capacity & Counsellor Availability**
5. **Safety Override**: Immediate crisis signals bypass normal routing directly to on-call clinical triage.

### Multi-Department Coordination
If a student reports exam panic, sleep disruption, and fee deadlines, HERE routes to **Academic Strategy** + **Counselling** + **Financial Aid** under **one unified case ID**. The student never fills out multiple redundant tickets.

---

## 10. Signature Feature: Waitlist Swap Engine

When a scheduled appointment is canceled:
1. The freed slot is fed to `waitlistSwapService.js`.
2. All students in the waiting queue are ranked using a **4-Factor Algorithm**:
   $$\text{Score} = \text{Dept Compatibility (40)} + \text{Urgency Tier (30)} + \text{Wait Time (20)} + \text{Modality (10)}$$
3. An automated swap notification is dispatched to the highest-ranking candidate:
   > *"An earlier appointment with Dr. Sarah Jenkins on Wednesday at 10:00 AM just opened up. Would you like to swap?"*
4. The student chooses:
   - **Take this appointment**: The schedule is updated immediately.
   - **Keep my current slot**: The offer automatically advances to the next candidate in the queue.

---

## 11. Counsellor Workflow

1. Counsellor logs in via `counsellor@here.demo`.
2. Opens the **Sanctuary Cockpit** (`/counsellor`).
3. Reviews incoming cases ordered by urgency tier.
4. Inspects the **Student-Approved AI Summary** and **Clinical Briefing**:
   - Presenting concern & cognitive friction
   - Biological/sleep impact
   - Timeline & duration
   - ML intent confidence distribution
5. Executes primary actions:
   - **Accept Case**: Claims primary ownership.
   - **Message Student**: Sends empathetic responses directly into the student's My Journey view.
   - **Offer / Schedule Consultation**: Books in-person or video appointments.

---

## 12. Admin Workflow & Campus Pulse

1. Admin logs in via `admin@here.demo`.
2. Opens the **Operational Cockpit** (`/admin`).
3. Reviews **Campus Pulse** anonymized trends:
   - Exam season anxiety spikes (+28%)
   - Sleep disruption surges (+34%)
   - Department workload utilization bars across all 12 faculties
   - Waitlist duration and average response metrics
4. **FERPA Compliance**: Absolutely zero identifiable student records, names, or private messages are exposed in the administrative analytics view.

---

## 13. Safety & Crisis Detection Layer

Safety detection executes **before** standard conversational processing.

```text
Student Message
       │
       ▼
┌─────────────────────────┐
│   Safety Interceptor    │
│  Deterministic + N-gram │
└─────────────────────────┘
       │
       ├─ [Crisis Signal Detected] ──> CRISIS INTERVENTION MODE
       │                               ├── Assistant orb glows coral
       │                               ├── Halts academic questioning
       │                               ├── Displays 988 Lifeline & 741741 Crisis Text
       │                               └── Triggers urgent human escalation
       │
       └─ [Normal Context] ──────────> Continue LLM Progressive Discovery
```

*Ethical Rule: HERE never makes diagnostic assertions (e.g., "You are clinically depressed") and strictly acts as a compassionate navigation and triage portal.*

---

## 14. Documentation Directory

Detailed documentation is available in the `docs/` folder:
- **[`docs/architecture.md`](docs/architecture.md)**: Deep dive into the four-layer architecture, sequence diagrams, and security models.
- **[`docs/api.md`](docs/api.md)**: Exhaustive REST API reference for all 18 endpoints.
- **[`docs/ml.md`](docs/ml.md)**: Machine learning methodology, feature engineering, and evaluation benchmarks.
- **[`docs/demo.md`](docs/demo.md)**: Step-by-step 21-point evaluator demonstration script.
- **[`ml/README.md`](ml/README.md)**: Dedicated study guide for the Python Scikit-Learn subsystem.

---

## 15. License

Developed for the **ServiceNow Student Challenge (Track 4: Self-Service Support Portal)**.  
Built with care for university students everywhere.
