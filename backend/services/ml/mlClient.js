// ML Service Client for HERE Platform
// Invokes the independent Python ML model or transparently falls back to explainable prototype rules

import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_PATH = path.resolve(__dirname, '../../../ml/src/predict.py');

export async function classifySupportCase(text) {
  if (!text || typeof text !== 'string') {
    return getFallbackClassification(text);
  }

  // 1. Attempt to execute the trained Python ML model
  try {
    const pyOutput = await runPythonPredict(text);
    if (pyOutput && pyOutput.primaryIntent) {
      return {
        ...pyOutput,
        classifiedAt: new Date().toISOString(),
        engine: 'Scikit-Learn TF-IDF Logistic Regression Pipeline'
      };
    }
  } catch (err) {
    // Graceful fallback with clear audit flag
    console.warn('[ML CLIENT] Python model execution unavailable, engaging explainable prototype classifier:', err.message);
  }

  // 2. Deterministic Prototype Classifier (Clearly tagged)
  return getFallbackClassification(text);
}

function runPythonPredict(text) {
  return new Promise((resolve, reject) => {
    execFile('python', [SCRIPT_PATH, text], { timeout: 8000 }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse ML JSON output: ${stdout}`));
      }
    });
  });
}

function getFallbackClassification(text) {
  const clean = (text || '').toLowerCase();
  let primaryIntent = 'general_support';
  let urgencyLevel = 'GREEN';
  let conf = 0.88;

  const probs = {
    academic_support: 0.10,
    counselling_wellbeing: 0.10,
    financial_assistance: 0.05,
    student_affairs: 0.05,
    housing: 0.05,
    accessibility: 0.05,
    career_support: 0.05,
    general_support: 0.45,
    multi_support: 0.10
  };

  if (/\b(exam|exams|assignment|finals|study|midterm|coursework|deadline|grade|gpa)\b/i.test(clean)) {
    primaryIntent = 'academic_support';
    probs.academic_support = 0.85;
    probs.general_support = 0.05;
  }

  if (/\b(sleep|depressed|anxiety|panic|crying|stress|burnout|counsellor|therapist)\b/i.test(clean)) {
    if (primaryIntent === 'academic_support') {
      primaryIntent = 'multi_support';
      probs.multi_support = 0.82;
      probs.counselling_wellbeing = 0.78;
    } else {
      primaryIntent = 'counselling_wellbeing';
      probs.counselling_wellbeing = 0.86;
    }
  }

  if (/\b(rent|tuition|fee|fees|money|bursary|afford|grant)\b/i.test(clean)) {
    if (primaryIntent !== 'general_support') {
      primaryIntent = 'multi_support';
      probs.multi_support = 0.85;
      probs.financial_assistance = 0.80;
    } else {
      primaryIntent = 'financial_assistance';
      probs.financial_assistance = 0.88;
    }
  }

  if (/\b(two weeks|2 weeks|barely sleep|can't keep up|overwhelm|evict|eviction)\b/i.test(clean)) {
    urgencyLevel = 'AMBER';
  }

  return {
    text,
    primaryIntent,
    intentProbabilities: probs,
    urgencyLevel,
    urgencyProbabilities: {
      green: urgencyLevel === 'GREEN' ? 0.80 : 0.15,
      amber: urgencyLevel === 'AMBER' ? 0.78 : 0.18,
      red: urgencyLevel === 'RED' ? 0.90 : 0.04
    },
    confidence: conf,
    isModelInference: false,
    source: 'PROTOTYPE DEMO FALLBACK CLASSIFIER',
    note: 'Running in explainable prototype fallback mode'
  };
}
