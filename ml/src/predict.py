"""
Prediction Script for HERE ML Layer
Runs inference for a given student text and outputs structured JSON predictions.
"""

import sys
import os
import json
import joblib

def load_models():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..'))

    intent_dir = os.path.join(project_root, 'models', 'intent_model')
    urgency_dir = os.path.join(project_root, 'models', 'urgency_model')

    intent_clf_path = os.path.join(intent_dir, 'intent_classifier.joblib')
    intent_vec_path = os.path.join(intent_dir, 'intent_vectorizer.joblib')

    urgency_clf_path = os.path.join(urgency_dir, 'urgency_classifier.joblib')
    urgency_vec_path = os.path.join(urgency_dir, 'urgency_vectorizer.joblib')

    if not (os.path.exists(intent_clf_path) and os.path.exists(intent_vec_path)):
        return None, None, None, None

    intent_clf = joblib.load(intent_clf_path)
    intent_vec = joblib.load(intent_vec_path)

    urgency_clf = joblib.load(urgency_clf_path)
    urgency_vec = joblib.load(urgency_vec_path)

    return intent_clf, intent_vec, urgency_clf, urgency_vec

def predict_single(text: str):
    intent_clf, intent_vec, urgency_clf, urgency_vec = load_models()

    if intent_clf is None:
        return {
            "text": text,
            "primaryIntent": "general_support",
            "intentProbabilities": {"general_support": 1.0},
            "urgencyLevel": "green",
            "urgencyProbabilities": {"green": 1.0},
            "confidence": 0.50,
            "isModelInference": False,
            "fallbackReason": "Trained model files not found on disk"
        }

    # Intent inference
    X_intent = intent_vec.transform([text])
    intent_probs = intent_clf.predict_proba(X_intent)[0]
    intent_classes = intent_clf.classes_
    intent_dict = {cls: round(float(prob), 4) for cls, prob in zip(intent_classes, intent_probs)}
    primary_intent = intent_classes[intent_probs.argmax()]
    intent_conf = round(float(intent_probs.max()), 4)

    # Urgency inference
    X_urgency = urgency_vec.transform([text])
    urgency_probs = urgency_clf.predict_proba(X_urgency)[0]
    urgency_classes = urgency_clf.classes_
    urgency_dict = {cls: round(float(prob), 4) for cls, prob in zip(urgency_classes, urgency_probs)}
    urgency_level = urgency_classes[urgency_probs.argmax()].upper()
    urgency_conf = round(float(urgency_probs.max()), 4)

    return {
        "text": text,
        "primaryIntent": primary_intent,
        "intentProbabilities": intent_dict,
        "urgencyLevel": urgency_level,
        "urgencyProbabilities": urgency_dict,
        "confidence": round((intent_conf + urgency_conf) / 2.0, 4),
        "isModelInference": True
    }

if __name__ == '__main__':
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "I have exams next week and I cannot concentrate or sleep"

    result = predict_single(query)
    print(json.dumps(result, indent=2))
