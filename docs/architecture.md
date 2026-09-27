# HERE System Architecture
**ServiceNow Student Challenge Track 4: Self-Service Support Portal**

> **Tagline**: *"You don't have to figure it all out."*

---

## 1. High-Level System Architecture

```
Student (Web / Mobile)
   │
   ▼
HERE Frontend (React 18 + Three.js Glass UI)
   │
   │  HTTPS JSON / API Client
   ▼
Backend API Gateway (Express.js)
   │
   ├──▶ [1. Pre-Processing Safety Layer] (Crisis Interception / 24/7 Hotline Override)
   │
   ├──▶ [2. LLM Conversational Engine] (Gemini / OpenAI / Empathic Local Discovery)
   │         │
   │         ▼
   │     Structured Context State (Source, Friction, Sleep, Duration, Urgency)
   │         │
   │         ▼
   ├──▶ [3. Dedicated ML Classification Layer] (Python Scikit-Learn TF-IDF Pipeline)
   │         │
   │         ▼
   │     Intent Probabilities & Urgency Tiers
   │         │
   │         ▼
   ├──▶ [4. Intelligent Routing Engine] (Coordinated Multi-Department Dispatch)
   │         │
   │         ▼
   ├──▶ [5. Case Management & Dual Clinical Reports] (Student Summary + Counsellor Briefing)
   │         │
   │         ▼
   ├──▶ [6. Appointment Scheduling & Signature Waitlist Swap]
   │
   ▼
Persistent Database Layer (File-backed JSON ACID Engine / SQLite Compatible)
   │
   ├───────────────┬───────────────┐
   ▼               ▼               ▼
Student Portal  Counsellor Portal  Admin Campus Pulse
(My Journey)    (Case Triage)      (Aggregate Demand)
```

---

## 2. Core Separation of Responsibilities

### **LLM = "TALKS"**
- Empathetic conversational discovery.
- Unpacking vague student statements without premature assumptions.
- Asking one adaptive follow-up question at a time.
- Generating student-readable summaries ("Here's what I'm understanding so far...").
- Formulating conversational explanations ("Why this department was recommended...").
- **Strict Limitation**: Never diagnoses illnesses, never enforces routing rules directly, never directly writes to database tables.

### **ML = "CLASSIFIES"**
- Lives in an independent `/ml/` folder with its own datasets, feature engineering, and training pipeline.
- Performs fast (sub-10ms) deterministic multi-class intent classification and urgency classification.
- Produces mathematical probability distribution vectors for full auditability and explainability.
- Runs completely decoupled from the conversational LLM.

### **BACKEND = "ACTS"**
- Enforces role-based access control (`STUDENT`, `COUNSELLOR`, `ADMIN`).
- Governs case lifecycle transitions (`SUBMITTED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `APPOINTMENT_SCHEDULED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`).
- Executes the signature **Waitlist Swap** matching algorithm on appointment cancellations.
- Generates dual reports (Student Summary + Counsellor Clinical Briefing).
- Dispatches event-driven notifications.

### **HUMAN = "SUPPORTS"**
- The licensed counsellor reviews student-approved summaries.
- Conducts consultations without forcing students to repeat intake history.
- Sends bi-directional messages and schedules bespoke consultations.

---

## 3. Security & FERPA Privacy Safeguards

1. **Zero Hardcoded Secrets**: All API keys reside exclusively in server-side `.env` files and are never bundled into client-side JavaScript.
2. **Student Consent Gate**: No private conversation transcript is exposed to counsellors without student approval. The counsellor dashboard receives only the **student-verified AI Mirror summary**.
3. **Anonymized Campus Pulse**: The Administrator Dashboard aggregates statistics across departments and queues with zero student PII exposure.
4. **Safety Pre-Check**: Suicide and self-harm keywords trigger immediate crisis mode, bypassing normal routing to offer live 24/7 human crisis hotlines without diagnosing.
