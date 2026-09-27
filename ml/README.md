# HERE Machine Learning Classification Engine
**ServiceNow Student Challenge Track 4: Self-Service Support Portal**

This directory houses the independent, production-grade Machine Learning classification service for the HERE student support platform. It is decoupled from the user-facing LLM conversational engine and provides explainable, reproducible, and verifiable intent and urgency routing signals.

> 📖 **Comprehensive ML Masterclass & Defense Manual**: For a full first-principles mathematical and architectural guide covering all 23 lessons (theory, derivations, code, and judge defense scripts), see [**`docs/ml_masterclass.md`**](../docs/ml_masterclass.md).

---

## 1. Architectural Philosophy: Why ML is Used

In enterprise and higher-education support environments (such as ServiceNow ITSM and CSM):

| Layer | Primary Role | What It Does NOT Do |
| :--- | :--- | :--- |
| **LLM (Language Model)** | Natural conversation, empathy, contextual clarification, student & counsellor summaries. | Does NOT enforce deterministic routing rules, does NOT bypass security/triage. |
| **ML (Machine Learning)** | Fast, verifiable classification of support intent and urgency tiers. Probabilistic confidence vectors. | Does NOT converse with students or hallucinate narrative. |
| **Backend Service** | Business logic, case lifecycle, counsellor queue allocation, calendar scheduling, notifications. | Does NOT guess student intent without ML/LLM signals. |
| **Human Counsellor** | Compassionate care, appointment delivery, clinical oversight. | Does NOT conduct redundant intake interrogations. |

### Why LLM Alone is Not Enough
1. **Explainability & Auditing**: University governance and FERPA/HIPAA regulations require deterministic, explainable classification probabilities rather than opaque black-box token generations.
2. **Latency & Throughput**: Classical ML inference executes in under **10 milliseconds**, whereas calling commercial LLMs takes 800ms–2500ms.
3. **Reproducibility**: Linear models (Logistic Regression / SVM with TF-IDF) produce mathematical, non-stochastic classification vectors suitable for automated ServiceNow routing queues.
4. **Resilience & Cost**: The ML routing layer operates completely offline with zero API token consumption.

---

## 2. Supported Classes

### A. Intent Classes (9 University Support Coordinates)
1. `academic_support`: Study workload, exam concessions, tutor matching, dissertation guidance.
2. `counselling_wellbeing`: Stress, anxiety, mindfulness, depression, emotional resilience.
3. `financial_assistance`: Hardship bursaries, tuition deferrals, emergency grocery aid, student loans.
4. `student_affairs`: Social isolation, student clubs, campus life adjustment, flatmate mediation.
5. `housing`: Tenancy disputes, emergency campus accommodation, lease review.
6. `accessibility`: Neurodivergent accommodations, exam concessions, physical accessibility.
7. `career_support`: Internship applications, CV review, mock interviews, graduate schemes.
8. `general_support`: Library hours, enrollment letters, student ID cards, campus navigation.
9. `multi_support`: Cross-cutting situations touching multiple coordinates simultaneously.

### B. Urgency Classes (Support Routing Tiers)
- `GREEN`: Standard inquiry. Routine queue resolution within 24–48 hours.
- `AMBER`: Compound friction, sleep disruption, or approaching deadline. Expedited review within 12–24 hours.
- `RED`: Severe distress or critical life crisis. Triggers immediate crisis bypass and human handoff protocols. *(Note: Not a clinical diagnosis)*.

---

## 3. Dataset Format

Sample dataset is located at `ml/data/sample/student_support_dataset.csv`.
Columns:
- `text`: Natural language statement from university student.
- `intent`: Target support category coordinate.
- `urgency`: Routing priority tier (`green`, `amber`, `red`).

---

## 4. Feature Extraction & Modeling

1. **Preprocessing (`src/preprocessing.py`)**:
   - Lowercasing, URL removal, punctuation cleaning, whitespace normalization.
2. **Feature Engineering (`src/feature_engineering.py`)**:
   - Sublinear TF-IDF vectorization with unigrams and bigrams (`ngram_range=(1, 2)`).
   - Stop-word pruning and maximum vocabulary filtering.
3. **Classifiers**:
   - **Intent Classifier (`src/train_intent.py`)**: Multi-class Logistic Regression with L2 regularization ($C = 2.0$).
   - **Urgency Classifier (`src/train_urgency.py`)**: Class-weighted Logistic Regression ($C = 1.5$) ensuring high recall for critical and amber situations.

---

## 5. How to Train & Evaluate

From the repository root:

```bash
# 1. Install dependencies
cd ml
pip install -r requirements.txt

# 2. Train Intent Model
python src/train_intent.py

# 3. Train Urgency Model
python src/train_urgency.py

# 4. Evaluate Models (Metrics & Confusion Matrix)
python src/evaluate.py

# 5. Run Live Single Prediction
python src/predict.py "Exams are next week and I cannot concentrate or sleep"
```

---

## 6. Model Artifacts Directory Structure

```
ml/
├── data/
│   └── sample/
│       └── student_support_dataset.csv
├── models/
│   ├── intent_model/
│   │   ├── intent_classifier.joblib
│   │   ├── intent_vectorizer.joblib
│   │   └── classes.joblib
│   └── urgency_model/
│       ├── urgency_classifier.joblib
│       ├── urgency_vectorizer.joblib
│       └── urgency_classes.joblib
├── src/
│   ├── preprocessing.py
│   ├── feature_engineering.py
│   ├── train_intent.py
│   ├── train_urgency.py
│   ├── evaluate.py
│   └── predict.py
├── config.yaml
├── requirements.txt
└── README.md
```

---

## 7. Backend Integration (`backend/services/ml/mlClient.js`)

The Node/Express backend communicates with this ML service via child process invocation or high-performance JSON-RPC. If the Python environment is ever offline or in light demo environments, the backend includes an explainable semantic fallback bridge clearly labeled as **"DEMO FALLBACK CLASSIFICATION"** to ensure zero demonstration disruption.
