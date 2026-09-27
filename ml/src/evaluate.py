"""
Model Evaluation Script for HERE ML Layer
Computes Precision, Recall, F1-score, and Confusion Matrices for Intent & Urgency models.
"""

import os
import csv
import joblib
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

def load_data(csv_path):
    texts, intents, urgencies = [], [], []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get('text'):
                texts.append(row['text'].strip())
                intents.append(row.get('intent', '').strip())
                urgencies.append(row.get('urgency', '').strip().lower())
    return texts, intents, urgencies

def evaluate():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..'))
    data_path = os.path.join(project_root, 'data', 'sample', 'student_support_dataset.csv')
    
    intent_dir = os.path.join(project_root, 'models', 'intent_model')
    urgency_dir = os.path.join(project_root, 'models', 'urgency_model')

    print("=" * 60)
    print("HERE ML LAYER EVALUATION BENCHMARK")
    print("=" * 60)

    texts, true_intents, true_urgencies = load_data(data_path)

    # 1. Evaluate Intent Model
    if os.path.exists(os.path.join(intent_dir, 'intent_classifier.joblib')):
        intent_clf = joblib.load(os.path.join(intent_dir, 'intent_classifier.joblib'))
        intent_vec = joblib.load(os.path.join(intent_dir, 'intent_vectorizer.joblib'))

        X_intent = intent_vec.transform(texts)
        pred_intents = intent_clf.predict(X_intent)

        print("\n--- INTENT CLASSIFIER EVALUATION ---")
        print(f"Overall Accuracy: {accuracy_score(true_intents, pred_intents) * 100:.2f}%\n")
        print(classification_report(true_intents, pred_intents, zero_division=0))
        print("Confusion Matrix:\n", confusion_matrix(true_intents, pred_intents))
    else:
        print("[!] Intent model not trained yet. Run train_intent.py first.")

    # 2. Evaluate Urgency Model
    if os.path.exists(os.path.join(urgency_dir, 'urgency_classifier.joblib')):
        urgency_clf = joblib.load(os.path.join(urgency_dir, 'urgency_classifier.joblib'))
        urgency_vec = joblib.load(os.path.join(urgency_dir, 'urgency_vectorizer.joblib'))

        X_urgency = urgency_vec.transform(texts)
        pred_urgencies = urgency_clf.predict(X_urgency)

        print("\n--- URGENCY CLASSIFIER EVALUATION ---")
        print(f"Overall Accuracy: {accuracy_score(true_urgencies, pred_urgencies) * 100:.2f}%\n")
        print(classification_report(true_urgencies, pred_urgencies, zero_division=0))
        print("Confusion Matrix:\n", confusion_matrix(true_urgencies, pred_urgencies))
    else:
        print("[!] Urgency model not trained yet. Run train_urgency.py first.")

if __name__ == '__main__':
    evaluate()
