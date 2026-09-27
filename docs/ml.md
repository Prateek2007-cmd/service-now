# HERE Machine Learning Pipeline Documentation
**ServiceNow Student Challenge Track 4: ML Architecture**

The machine learning layer operates as a completely decoupled, standalone service inside `/ml/`.

---

## 1. Problem Formulation

1. **Task 1: Support Intent Classification (Multi-class)**
   - Inputs: Normalized student text.
   - Outputs: 9 support classes (`academic_support`, `counselling_wellbeing`, `financial_assistance`, `student_affairs`, `housing`, `accessibility`, `career_support`, `general_support`, `multi_support`).
2. **Task 2: Support Routing Urgency (Multi-class)**
   - Inputs: Normalized student text + compound friction indicators.
   - Outputs: 3 operational urgency tiers (`GREEN`, `AMBER`, `RED`).

---

## 2. Feature Engineering & Preprocessing

- **Cleaning**: Removal of noise, URLs, special punctuation while preserving natural contractions (`can't`, `haven't`).
- **Tokenization**: Sublinear TF-IDF representation with unigram and bigram extraction (`ngram_range=(1, 2)`).
- **Sublinear TF**: Reduces the impact of high-frequency repetitive words via logarithmic frequency weighting:
  $$\text{tf}_{\text{sublinear}} = 1 + \log(\text{tf}) \quad \text{for } \text{tf} > 0$$

---

## 3. Model Architecture & Hyperparameters

- **Classifier**: Multi-Class Logistic Regression with L2 Regularization ($C = 2.0$ for intent, $C = 1.5$ for urgency).
- **Class Balancing**: Balanced class weighting applied to urgency modeling to ensure high sensitivity on urgent (`AMBER`) and critical (`RED`) cases.
- **Optimization Algorithm**: L-BFGS solver with maximum iterations $1000$.

---

## 4. Benchmark Evaluation Results

Evaluated on stratified synthetic test splits:

| Metric | Intent Classifier | Urgency Classifier |
| :--- | :--- | :--- |
| **Overall Accuracy** | **83.97%** | **94.66%** |
| **Macro Average F1** | **0.86** | **0.93** |
| **Weighted Average F1** | **0.85** | **0.95** |
| **Average Inference Latency** | **< 6 ms** | **< 4 ms** |

---

## 5. Execution Commands

```bash
# Train Intent Model
python ml/src/train_intent.py

# Train Urgency Model
python ml/src/train_urgency.py

# Run Full Benchmark
python ml/src/evaluate.py

# Run Single Text Inference
python ml/src/predict.py "Exams are overwhelming me and I can't sleep"
```
