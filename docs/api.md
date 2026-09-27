# HERE API Documentation
**ServiceNow Student Challenge Track 4: Self-Service Support Portal**

All endpoints are served from `/api/*` and return JSON.

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and establishes role privileges.

**Request:**
```json
{
  "email": "student@here.demo",
  "password": "HEREdemo123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "STU-88219",
    "name": "Aarav Sharma",
    "email": "student@here.demo",
    "role": "STUDENT",
    "department": "School of Computer Science & Engineering",
    "year": "3rd Year Undergraduate",
    "avatarInitials": "AS",
    "avatarColor": "#F4B6D7"
  },
  "token": "here_token_STU-88219_1790548123"
}
```

---

## 2. Conversational Engine (`/api/chat`)

### `POST /api/chat`
Processes conversational turns through Safety Check, LLM / Discovery Engine, and ML classification.

**Request:**
```json
{
  "conversationId": "CONV-1790548123",
  "message": "I am suffering from pressure."
}
```

**Response (200 OK):**
```json
{
  "reply": "I hear you.\n\nWhen you say pressure, what's been weighing on you most lately?",
  "stage": "UNDERSTAND",
  "intent": "general_support",
  "themes": [],
  "urgency": "GREEN",
  "options": [
    "Exams and assignments",
    "Something personal",
    "Financial pressure",
    "Something else"
  ],
  "progress": "Listening and understanding your context..."
}
```

---

## 3. Safety Layer (`/api/safety`)

### `POST /api/safety/check`
Interception checkpoint for self-harm or urgent crisis expressions.

**Request:**
```json
{
  "message": "I want to die"
}
```

**Response (200 OK):**
```json
{
  "safetyStatus": "IMMEDIATE_DANGER",
  "isCrisis": true,
  "urgencyOverride": "RED",
  "reply": "I hear you, and I want to take what you just shared very seriously...",
  "safetyAlert": {
    "title": "Immediate Crisis Support Available 24/7",
    "emergencyContacts": [
      { "name": "Campus 24/7 Crisis Urgent Line", "number": "1-800-273-TALK" }
    ]
  }
}
```

---

## 4. Machine Learning Inference (`/api/ml`)

### `POST /api/ml/classify`
Runs inference on the trained Scikit-Learn TF-IDF model.

**Request:**
```json
{
  "text": "Exams are next week and I cannot sleep or concentrate"
}
```

**Response (200 OK):**
```json
{
  "text": "Exams are next week and I cannot sleep or concentrate",
  "primaryIntent": "academic_support",
  "intentProbabilities": {
    "academic_support": 0.3696,
    "counselling_wellbeing": 0.1131,
    "financial_assistance": 0.1008,
    "housing": 0.0833
  },
  "urgencyLevel": "AMBER",
  "urgencyProbabilities": {
    "amber": 0.5408,
    "green": 0.2752,
    "red": 0.184
  },
  "confidence": 0.4552,
  "isModelInference": true,
  "engine": "Scikit-Learn TF-IDF Logistic Regression Pipeline"
}
```

---

## 5. Case Management (`/api/cases`)

### `POST /api/cases`
Creates a verified support case following student confirmation of the AI Mirror.

**Request:**
```json
{
  "studentId": "STU-88219",
  "studentName": "Aarav Sharma",
  "confirmedSummary": "Student has been experiencing pressure from upcoming exams, difficulty concentrating and reduced sleep for approximately two weeks.",
  "selectedDepartments": ["Counselling & Mental Wellbeing", "Academic Support & Tutoring"]
}
```

**Response (201 Created):**
```json
{
  "id": "CASE-2026-90412",
  "status": "ASSIGNED_TO_COUNSELLOR",
  "assignedDepartment": "Counselling & Mental Wellbeing",
  "assignedCounsellor": "Dr. Sarah Jenkins",
  "studentApprovedSummary": "...",
  "counsellorClinicalSummary": "...",
  "urgency": "AMBER"
}
```

---

## 6. Appointments & Waitlist Swap (`/api/appointments` & `/api/waitlist`)

### `POST /api/appointments/book`
Books consultation and attaches to case file.

### `DELETE /api/appointments/:id`
Cancels appointment and automatically triggers the **Waitlist Swap** matching scan.

### `POST /api/waitlist/accept`
Accepts or declines an earlier appointment slot offer.

---

## 7. Counsellor Portal (`/api/counsellor`)

### `GET /api/counsellor/cases`
Lists active cases in counsellor's queue.

### `POST /api/counsellor/cases/:id/message`
Sends a message from counsellor directly into the student's unified journey thread.

### `POST /api/counsellor/cases/:id/accept`
Marks case as accepted by counsellor.

---

## 8. Admin & Campus Pulse (`/api/admin/analytics`)

### `GET /api/admin/analytics`
Returns aggregate statistics, department workload, and Campus Pulse trends with zero PII.
