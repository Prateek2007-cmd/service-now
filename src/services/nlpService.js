// NLP & Safety Service for HERE Student Support Platform
// Pure client-side ML/NLP abstraction designed for drop-in replacement with backend models

// Critical crisis & safety dictionary for immediate zero-delay safety triage
const SAFETY_PATTERNS = [
  /\b(suicid|kill myself|end my life|want to die|wanna die|don't want to live|don't want to be alive|not want to live|not want to be alive|self[- ]harm|cut myself|hang myself|take all my pills)\b/i,
  /\b(overdose|harm myself|end it all|can't go on living|nobody would miss me|better off dead|give up on life|i wanna die|i want to die|hurt myself)\b/i
];

// High urgency indicators (Amber/Red)
const HIGH_URGENCY_PATTERNS = [
  /\b(panic attack|can't breathe|haven't eaten in days|eviction|homeless|starving|can't afford food|emergency|crisis|failing everything|breakdown)\b/i,
  /\b(can't get out of bed|4 days in dorm|severe depression|crying non[- ]stop|hopeless|drowning in work)\b/i
];

// Entity & Theme taxonomy across 12 university departments
const THEME_TAXONOMY = {
  academic_pressure: {
    label: 'Academic Pressure',
    keywords: ['exam', 'exams', 'finals', 'midterm', 'midterms', 'fail', 'failing', 'grade', 'grades', 'gpa', 'study', 'studying', 'syllabus', 'coursework', 'assignment', 'assignments', 'deadline', 'behind', 'extension', 'professor'],
    dept: 'Academic Support & Tutoring',
    intent: 'ACADEMIC_SUPPORT',
    relevance: 'High',
    color: '#8EDCF2'
  },
  sleep_disturbance: {
    label: 'Sleep Difficulties & Exhaustion',
    keywords: ['sleep', 'sleeping', 'slept', 'insomnia', 'awake', 'tired', 'exhausted', 'burnout', 'fatigue', 'nightmare'],
    dept: 'Counselling & Wellbeing',
    intent: 'MENTAL_WELLBEING',
    relevance: 'High',
    color: '#F4B6D7'
  },
  financial_concern: {
    label: 'Financial Insecurity & Tuition',
    keywords: ['fee', 'fees', 'tuition', 'money', 'rent', 'groceries', 'bursary', 'grant', 'financial', 'afford', 'cost', 'job', 'shift', 'broke', 'debt'],
    dept: 'Financial Assistance & Emergency Grants',
    intent: 'FINANCIAL_ASSISTANCE',
    relevance: 'High',
    color: '#EBA756'
  },
  emotional_wellbeing: {
    label: 'Emotional Wellbeing & Anxiety',
    keywords: ['anxiety', 'anxious', 'stress', 'stressed', 'panic', 'overwhelmed', 'crying', 'sad', 'scared', 'nervous', 'dread', 'mental', 'counsellor', 'therapy', 'therapist'],
    dept: 'Counselling & Wellbeing',
    intent: 'MENTAL_WELLBEING',
    relevance: 'High',
    color: '#F4B6D7'
  },
  social_isolation: {
    label: 'Social Isolation & Loneliness',
    keywords: ['alone', 'isolated', 'lonely', 'no friends', 'invisible', 'homesick', 'disconnected', 'dorm', 'belonging', 'stranger'],
    dept: 'Student Affairs & Campus Life',
    intent: 'STUDENT_AFFAIRS',
    relevance: 'Medium',
    color: '#C7B8F5'
  },
  housing_instability: {
    label: 'Housing & Living Conditions',
    keywords: ['landlord', 'evict', 'eviction', 'lease', 'roommate', 'dormitory', 'homeless', 'couch', 'international', 'visa'],
    dept: 'Housing & International Student Support',
    intent: 'HOUSING_INTERNATIONAL',
    relevance: 'High',
    color: '#8DCFA9'
  },
  accessibility_needs: {
    label: 'Accessibility & Chronic Health Accommodations',
    keywords: ['adhd', 'autism', 'disability', 'accommodation', 'accommodations', 'chronic', 'illness', 'impairment', 'extra time', 'medical note'],
    dept: 'Accessibility & Disability Services',
    intent: 'ACCESSIBILITY',
    relevance: 'High',
    color: '#93C5FD'
  },
  career_anxiety: {
    label: 'Career & Graduate Pathways',
    keywords: ['career', 'internship', 'resume', 'job', 'graduating', 'unemployed', 'future', 'interview'],
    dept: 'Career Development Center',
    intent: 'CAREER_SUPPORT',
    relevance: 'Medium',
    color: '#FDE047'
  }
};

/**
 * Check if message triggers the Safety Layer before any normal routing occurs
 */
export function evaluateSafetyLayer(message) {
  const clean = message.toLowerCase();
  for (const pattern of SAFETY_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        isSafetyCrisis: true,
        urgency: 'RED',
        safetyAlert: {
          title: 'Immediate Crisis Support Available 24/7',
          message: 'We hear that you are going through immense pain right now. Your safety and wellbeing are paramount. HERE prioritizes immediate human connection.',
          emergencyContacts: [
            { name: 'Campus 24/7 Crisis Urgent Line', number: '1-800-273-TALK', available: 'Always Open' },
            { name: 'Student Wellbeing Fast-Response Triage', number: 'Ext. 4433 (Campus Safety)', available: 'Immediate Handoff' },
            { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: 'Free & Confidential' }
          ],
          actions: [
            { label: 'Connect to Urgent Counselor Now', type: 'crisis_handoff' },
            { label: 'Call 24/7 Support Hotline', type: 'phone_call' }
          ]
        }
      };
    }
  }
  return { isSafetyCrisis: false };
}

/**
 * Core NLP analysis function
 * Returns structured classification, urgency tier, multi-department recommendations, and AI mirror summary
 */
export async function analyzeStudentMessage(message) {
  // Simulate realistic NLP latency (300-600ms)
  await new Promise(r => setTimeout(r, 450));

  const lower = message.toLowerCase().trim();

  // 1. Safety check
  const safetyCheck = evaluateSafetyLayer(lower);
  if (safetyCheck.isSafetyCrisis) {
    return {
      intent: 'CRISIS_SUPPORT',
      urgency: 'RED',
      confidence: 0.98,
      isCrisis: true,
      safetyAlert: safetyCheck.safetyAlert,
      themes: ['Immediate Crisis', 'Emotional Distress'],
      entities: ['Crisis Support Required'],
      recommendedServices: [
        {
          name: 'Emergency Student Wellbeing Triage',
          department: 'Counselling & Wellbeing',
          availability: 'Immediate (< 2 minutes)',
          priority: 'Urgent Intervention',
          color: '#F87171'
        }
      ],
      aiMirror: "We detected that you're going through a very critical moment. Please know you are not alone, and we are connecting you directly to immediate confidential human help.",
      explanation: "Safety analysis detected high-risk crisis keywords. Protocol bypasses standard queues for immediate human intervention."
    };
  }

  // 2. Theme & Entity Extraction using Semantic Term Frequency
  const matchedThemes = [];
  const detectedDepts = new Set();
  const detectedIntents = new Set();

  for (const [key, theme] of Object.entries(THEME_TAXONOMY)) {
    let matchCount = 0;
    for (const kw of theme.keywords) {
      // Word boundary match
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(lower)) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      matchedThemes.push({
        id: key,
        label: theme.label,
        relevance: matchCount >= 2 ? 'High' : 'Medium',
        matchCount,
        dept: theme.dept,
        intent: theme.intent,
        color: theme.color
      });
      detectedDepts.add(theme.dept);
      detectedIntents.add(theme.intent);
    }
  }

  // Fallback if no specific keyword matched
  if (matchedThemes.length === 0) {
    matchedThemes.push({
      id: 'general_guidance',
      label: 'General Student Support & Navigation',
      relevance: 'High',
      matchCount: 1,
      dept: 'Student Affairs & Campus Life',
      intent: 'GENERAL_SUPPORT',
      color: '#8EDCF2'
    });
    detectedDepts.add('Student Affairs & Campus Life');
    detectedIntents.add('GENERAL_SUPPORT');
  }

  // Sort themes by match count and relevance
  matchedThemes.sort((a, b) => b.matchCount - a.matchCount);

  // 3. Urgency Classification
  let urgency = 'GREEN';
  let urgencyReason = 'General advisory and informational request';

  const hasHighUrgencyWord = HIGH_URGENCY_PATTERNS.some(p => p.test(lower));
  if (hasHighUrgencyWord || (detectedDepts.size >= 2 && matchedThemes.some(t => t.id === 'emotional_wellbeing' || t.id === 'housing_instability'))) {
    urgency = 'AMBER';
    urgencyReason = 'Student expressed multiple compound pressures or elevated distress requiring prompt coordination';
  }

  // 4. Intent Formulation (single or multi-department)
  const isMultiDepartment = detectedDepts.size > 1;
  const primaryIntent = isMultiDepartment ? 'MULTI_DEPARTMENT' : Array.from(detectedIntents)[0] || 'GENERAL_SUPPORT';

  // 5. Recommended Services across the Support Graph
  const recommendedServices = Array.from(detectedDepts).map(deptName => {
    let serviceTitle = deptName;
    let turnAround = 'Within 24–48 hours';
    let role = 'Specialist Advisor';

    if (deptName.includes('Academic')) {
      serviceTitle = 'Academic Strategy & Deadline Mitigation';
      turnAround = 'Same-day consultation';
      role = 'Academic Advisor / Study Specialist';
    } else if (deptName.includes('Counselling') || deptName.includes('Wellbeing')) {
      serviceTitle = 'Confidential 1-on-1 Student Wellbeing Session';
      turnAround = urgency === 'AMBER' ? 'Expedited within 12–24h' : 'Within 48 hours';
      role = 'Licensed Student Counsellor';
    } else if (deptName.includes('Financial')) {
      serviceTitle = 'Emergency Student Hardship Grant & Fee Advisory';
      turnAround = 'Instant bursary assessment';
      role = 'Student Financial Aid Officer';
    } else if (deptName.includes('Housing')) {
      serviceTitle = 'Emergency Housing & Tenant Rights Support';
      turnAround = 'Within 24 hours';
      role = 'Campus Housing Advocate';
    } else if (deptName.includes('Accessibility')) {
      serviceTitle = 'Exam & Coursework Accommodation Registry';
      turnAround = 'Within 48 hours';
      role = 'Accessibility Coordinator';
    }

    return {
      department: deptName,
      serviceTitle,
      turnAround,
      role,
      status: 'Ready to Connect'
    };
  });

  // 6. AI Mirror Summary & Narrative Explanation
  const themeLabels = matchedThemes.map(t => t.label.toLowerCase());
  let mirrorNarrative = '';

  if (matchedThemes.length === 1) {
    mirrorNarrative = `It sounds like you're navigating challenges around ${themeLabels[0]}. You don't have to carry this alone.`;
  } else if (matchedThemes.length === 2) {
    mirrorNarrative = `It sounds like you're experiencing both ${themeLabels[0]} and ${themeLabels[1]}. HERE is coordinating both departments together so you won't have to tell your story twice.`;
  } else {
    const mainTwo = themeLabels.slice(0, 2).join(', ');
    mirrorNarrative = `It sounds like your situation touches a few interconnected areas, including ${mainTwo} and ${themeLabels[2]}. HERE has mapped a single unified pathway across all relevant services.`;
  }

  const rationale = `We detected references to ${matchedThemes.map(t => t.label).join(', ')}. Based on this, HERE recommends ${recommendedServices.map(s => s.department).join(' and ')}.`;

  return {
    intent: primaryIntent,
    isMultiDepartment,
    urgency,
    urgencyReason,
    confidence: isMultiDepartment ? 0.94 : 0.91,
    themes: matchedThemes,
    entities: matchedThemes.map(t => t.label),
    recommendedServices,
    aiMirror: mirrorNarrative,
    explanation: rationale,
    disclaimer: "This is a support recommendation, not a diagnosis. You are always in control of what happens next."
  };
}
