# HERE — Track 4 Demonstration & Evaluator Walkthrough Guide

> **Project**: HERE — Student Wellbeing Self-Service Support Platform  
> **ServiceNow Student Challenge**: Track 4 (Self-Service Support Portal)  
> **Tagline**: *"You don't have to figure it all out."*  

This walkthrough follows the exact **21-step demonstration story** requested for the ServiceNow Student Challenge evaluators. It illustrates the complete human-centered architectural separation:
- **LLM**: "TALKS" (Natural conversation, language understanding, empathetic inquiry, clinical & student summaries)
- **ML**: "CLASSIFIES" (Separate sub-10ms Scikit-Learn TF-IDF classifier for 9 intent classes and 3 urgency tiers)
- **BACKEND**: "ACTS" (Persistent database, intelligent routing, appointment reservation, waitlist swaps, notifications)
- **HUMAN**: "SUPPORTS" (Counsellor review of student-approved clinical briefing, secure messaging, and care plans)

---

## Quick Reference: Demo Accounts & URLs

| Role | Email | Password | Primary Landing URL | Key Function |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@here.demo` | `HEREdemo123` | `http://localhost:5173/chat` | Conversational discovery, AI Mirror, Pathway selection, Journey |
| **Counsellor** | `counsellor@here.demo` | `HEREdemo123` | `http://localhost:5173/counsellor` | Clinical intake briefing, case acceptance, messaging, slot offers |
| **Admin** | `admin@here.demo` | `HEREdemo123` | `http://localhost:5173/admin` | Campus Pulse analytics, department load, FERPA-compliant trends |

*Note: On the login page (`/login`), click any demo pill (**Student**, **Counsellor**, **Admin**) to auto-populate credentials instantly.*

---

## The 21-Step Master Demonstration Story

### Step 1: Student Logs In
1. Navigate to `http://localhost:5173/login`.
2. Click the **Student** pill or enter:
   - Email: `student@here.demo`
   - Password: `HEREdemo123`
3. Click **Sign in**. The user role is authenticated server-side; the student is seamlessly redirected without any awkward public role picker.

---

### Step 2: Student Opens HERE Chat Sanctuary
1. Navigate to `/chat` (or click **Start privately** from the top navigation).
2. Observe the dark, cinematic aesthetic, warm ambient glows, zero button outlines, and the 3D WebGL assistant orb idling gently.
3. Notice that the chat starts with open empathetic space, rather than a rigid questionnaire, dropdowns, or diagnostic interrogation.

---

### Step 3: Student Talks Naturally to HERE
1. In the chat input, type a vague opening statement:
   ```text
   I am suffering from pressure.
   ```
2. Click **Send** (or press Enter).
3. Observe the assistant orb transition from `idle` to `thinking` with the subtle status label: *"Understanding what you're dealing with..."*

---

### Step 4: AI Asks Intelligent Contextual Questions (No Early Jumping)
1. **Critical Architectural Principle**: Notice that HERE does **NOT** jump to recommendations, booking buttons, or say *"Would you like to book an appointment or view resources?"*.
2. HERE recognizes that "pressure" is ambiguous and responds empathetically:
   > *"I hear you. When you say pressure, what's been weighing on you most lately?"*
3. Student responds:
   ```text
   Exams and assignments.
   ```

---

### Step 5: Progressive Contextual Discovery (Workload $\rightarrow$ Impact $\rightarrow$ Duration)
1. HERE asks for clarification on the academic dimension:
   > *"Got it. Is it mainly the volume of work, the pressure to perform, or feeling like you're struggling to keep up?"*
2. Student replies:
   ```text
   I can't keep up and I can't concentrate.
   ```
3. HERE checks routine and physiological impact:
   > *"Has it been affecting your sleep or your routine outside studying too?"*
4. Student replies:
   ```text
   Yeah, I've barely been sleeping.
   ```
5. HERE gathers timeline:
   > *"How long has that been happening?"*
6. Student replies:
   ```text
   About two weeks.
   ```

---

### Step 6: AI Mirror Formulation
1. Having gathered **Themes** (Exam pressure, concentration difficulty), **Impact** (Sleep disruption, academic progress), and **Duration** (2 weeks), HERE pauses questioning and reflects its understanding:
   > *"Here's what I'm understanding so far.*  
   > *You're feeling pressure from your academic workload, finding it difficult to concentrate, and it's beginning to affect your sleep. You've been dealing with this for around two weeks.*  
   > *Did I get that right?"*

---

### Step 7: Student Confirms Reflection ("Yes, that's right")
1. Beneath the AI Mirror reflection, three interactive actions appear:
   - **Yes, that's right** (Proceed)
   - **Not quite** (Clarify)
   - **Edit** (Inline editing of the reflection summary)
2. Click **Yes, that's right**.
3. HERE records student verification: no support case is ever routed without explicit student validation.

---

### Step 8: Separate ML Classification Layer Executes
1. As soon as the student confirms, the backend calls the independent Scikit-Learn ML pipeline (`ml/src/predict.py` or Node ML service):
   - **Input Text**: `"Exams and assignments. I can't keep up and I can't concentrate. I've barely been sleeping for about two weeks."`
   - **Intent Model**: Evaluates TF-IDF n-grams $(1, 2)$ $\rightarrow$ Logistic Regression.
     - `academic_support`: 0.91
     - `counselling_wellbeing`: 0.84
     - `financial_assistance`: 0.04
   - **Urgency Model**: Categorizes urgency signals $\rightarrow$ `AMBER` (Expedited within 12–24h; noticeable routine/sleep disruption without self-harm crisis).
2. The classification is completely explainable, sub-10ms, and runs outside the LLM.

---

### Step 9: Intelligent Multi-Department Routing
1. The backend `routingEngine.js` processes the ML output:
   - Primary Intent: `academic_support`
   - Co-occurring Intent: `counselling_wellbeing`
   - Urgency Tier: `AMBER`
2. Instead of forcing the student to pick between tutoring or therapy, HERE routes to **Academic Strategy & Tutoring** AND **Counselling & Mental Wellbeing** in a coordinated support pathway.
3. The UI presents the coordinated pathway with transparent explanations for why each was recommended.

---

### Step 10: Case Creation with FERPA Privacy Receipt
1. The backend automatically:
   - Generates unique Case ID: e.g., `#CASE-2026-1042`.
   - Compiles dual summaries: Friendly Student Summary & Structured Counsellor Clinical Briefing.
   - Assigns Lead Specialist: `Dr. Sarah Jenkins` (or `Prof. Marcus Vance`).
2. The UI renders the **Privacy Receipt**:
   - **What HERE stored**: Student-approved summary, duration, detected support themes.
   - **What was shared with support staff**: De-identified clinical briefing and triage priority.
   - **What was NOT used**: Never used for disciplinary grading, never sold, never exposed to third-party ad networks.

---

### Step 11: Conversational Appointment Options Appear
1. Beneath the privacy receipt, available consultation slots are retrieved from the persistent database.
2. Filter options appear:
   - *Earliest Available* (Tomorrow afternoon)
   - *Video Consultation*
   - *Sanctuary In-Person (Suite 204)*

---

### Step 12: Student Books Appointment
1. Click on **Tomorrow, 3:30 PM — Dr. Sarah Jenkins (Sanctuary Suite 204 or Video)**.
2. The assistant orb glows with a calm green handoff pulse.
3. Case status transitions to `APPOINTMENT_SCHEDULED`.
4. Event dispatched:
   - System notification sent to Student.
   - Internal dispatch notification sent to Counsellor.

---

### Step 13: Counsellor Logs In
1. In another window or after logging out, navigate to `http://localhost:5173/login`.
2. Click the **Counsellor** pill:
   - Email: `counsellor@here.demo`
   - Password: `HEREdemo123`
3. Click **Sign in**. The system automatically directs the user to `/counsellor`.

---

### Step 14: Counsellor Sees New Case in Sanctuary Cockpit
1. The Counsellor Sanctuary Cockpit loads.
2. In the left queue, observe Case `#CASE-2026-1042` with an **AMBER** badge and tag: *Academic Pressure + Sleep Disruption*.
3. Click to open the case.

---

### Step 15: Counsellor Reviews the AI Clinical Briefing
1. The case view displays:
   - **Student-Approved Reflection**: The exact text confirmed by the student in Step 7.
   - **Counsellor Clinical Briefing**:
     - *Presenting Concern*: Compounding academic workload and exam deadlines.
     - *Cognitive Friction*: Difficulty concentrating, falling behind.
     - *Biological Impact*: Reduced restorative sleep for ~2 weeks.
     - *ML Intent Probabilities*: Academic Support (91%), Counselling (84%).
     - *Urgency*: AMBER.
2. The counsellor has all necessary context in 30 seconds without forcing the student to re-explain their trauma.

---

### Step 16: Counsellor Responds via Secure Message
1. In the **Response Composer**, the counsellor types:
   ```text
   Hi Aarav, I've reviewed what you shared about exam pressure and sleep disruption. You are not alone in this, and we have dedicated strategies to help you pace your coursework and regain restful sleep. Looking forward to our session tomorrow at 3:30 PM.
   ```
2. Click **Send Message**.
3. Status updates to `Counsellor Responded`.

---

### Step 17 & 18: Student Receives Response & Journey Updates
1. Return to the Student session (or navigate to `/journey`).
2. Click on **My Support Journey**.
3. The interactive timeline displays:
   - ✓ *Request Shared in Sanctuary*
   - ✓ *HERE Context Understood*
   - ✓ *Summary Confirmed by Student*
   - ✓ *Specialist Assigned (Dr. Sarah Jenkins)*
   - ✓ *Appointment Confirmed (Tomorrow 3:30 PM)*
   - 💬 *New Message from Dr. Jenkins* (Click to view full message)
4. Bridge Support displays personalized preparation guides:
   - *Today*: 5-minute breathing reset.
   - *Tomorrow*: What to bring to your academic strategy consultation.

---

### Step 19: Admin Operational Cockpit & Campus Pulse
1. Log in as Admin:
   - Email: `admin@here.demo`
   - Password: `HEREdemo123`
2. Navigate to `/admin`.
3. Review **Campus Pulse**:
   - Aggregate trends: *Academic Pressure (+28%)*, *Sleep Disruption (+34%)*, *Financial Aid (+12%)*.
   - Department Workload: Real-time utilization bars across all 12 university departments.
   - Urgency Tier distribution (Green 68%, Amber 28%, Red 4%).
   - Notice that all metrics are strictly anonymized, ensuring full FERPA compliance with zero student names or personal transcripts visible to operational staff.

---

### Step 20: Demonstrate Signature Feature: Waitlist Swap
1. In the Counsellor portal (`/counsellor`), switch to the **Queue & Waitlist** tab.
2. Observe waiting students who requested earlier consultations.
3. Click **Simulate Cancellation Slot**.
4. The **Waitlist Swap Engine** activates:
   - Evaluates eligible candidates based on 4-factor scoring:
     - Department compatibility (40 pts)
     - Urgency tier (30 pts)
     - Time on waitlist (20 pts)
     - Modality preference (10 pts)
   - Matches candidate `Alex Rivera` with a 92% compatibility score.
   - Dispatches swap offer: *"An earlier appointment on Wednesday at 10:00 AM just opened up. Would you like to swap?"*
5. Student receives notification with two options:
   - **Take this appointment** (Swaps automatically and updates calendar)
   - **Keep my current slot** (Offers to next candidate in queue)

---

### Step 21: Demonstrate Real-Time Safety Interruption
1. Log out or start a fresh student chat at `/chat`.
2. Type a crisis statement:
   ```text
   I don't want to live anymore.
   ```
3. Click **Send**.
4. **Safety Layer Triggered**:
   - The normal conversational engine and academic questioning are immediately halted.
   - The assistant orb changes to a protective coral/safety tone.
   - The AI responds with calm crisis grounding:
     > *"I'm really glad you told me. I want to take what you just said seriously. Are you in immediate danger of hurting yourself right now?"*
   - Emergency contact buttons appear:
     - 📞 **Call 988 Suicide & Crisis Lifeline** (Immediate connection)
     - 💬 **Text HOME to 741741 (Crisis Text Line)**
     - 🏥 **Connect with Campus On-Call Emergency Team (24/7)**
   - No diagnostic statements ("You are depressed", "You are suicidal") are ever made.
   - Human escalation protocols are activated instantly.

---

## Conclusion
This 21-step journey validates that **HERE** solves the fundamental problem of university student support: it provides a warm, respectful front door that listens deeply, structures needs scientifically, automates triage responsibly, and connects students to real humans without bureaucratic friction.
