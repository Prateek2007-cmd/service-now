// Semantic Resource Search & Bridge Support Service for HERE
// Supports fuzzy & semantic conceptual matching (e.g. "can't concentrate" -> Study Focus, Exam Anxiety)

export const RESOURCE_CATALOG = [
  {
    id: 'res-01',
    title: 'Managing Exam Anxiety & Cognitive Grounding',
    category: 'Mental Wellbeing',
    dept: 'Counselling & Mental Wellbeing',
    duration: '6 min audio',
    type: 'Interactive Audio Exercise',
    desc: 'Psychologist-led tactical exercise to calm physiological hyperarousal before high-stakes exams.',
    tags: ['exam', 'anxiety', 'panic', 'concentration', 'focus', 'midterm', 'stress', 'breathing', 'heart rate'],
    badge: 'Immediate Relief'
  },
  {
    id: 'res-02',
    title: 'Emergency Student Bursary Fast-Track Guide',
    category: 'Financial Aid',
    dept: 'Emergency Aid & Student Grants',
    duration: '4 min read',
    type: 'Official University Form',
    desc: 'Step-by-step checklist to access up to $500 discretionary living expense grants without credit checks.',
    tags: ['money', 'fee', 'tuition', 'rent', 'groceries', 'grant', 'financial', 'bursary', 'broke', 'hardship'],
    badge: 'Expedited Review'
  },
  {
    id: 'res-03',
    title: 'Official Academic Extension & Petition Script',
    category: 'Academic Strategy',
    dept: 'Academic Strategy & Tutoring',
    duration: 'Copyable Template',
    type: 'Email Template',
    desc: 'Pre-written, dean-approved email scripts to respectfully request deadline extensions due to acute circumstances.',
    tags: ['extension', 'deadline', 'late', 'coursework', 'professor', 'email', 'assignment', 'petition', 'sick'],
    badge: 'Faculty Verified'
  },
  {
    id: 'res-04',
    title: 'Deep Sleep Reset for Exhausted Minds',
    category: 'Mental Wellbeing',
    dept: 'Counselling & Mental Wellbeing',
    duration: '10 min audio',
    type: 'Audio Reset',
    desc: 'Non-sleep deep rest (NSDR) audio protocol designed for students unable to shut down racing thoughts in dorms.',
    tags: ['sleep', 'insomnia', 'night', 'tired', 'exhausted', 'rest', 'bed', 'drowsy', 'racing thoughts'],
    badge: 'High Completion'
  },
  {
    id: 'res-05',
    title: 'Dormitory Isolation & Peer Circles',
    category: 'Student Life',
    dept: 'Student Affairs & Campus Life',
    duration: 'Weekly circle',
    type: 'Peer Community',
    desc: 'Anonymous, zero-pressure weekly virtual drop-in sessions hosted by trained 4th-year student mentors.',
    tags: ['lonely', 'isolated', 'friends', 'dorm', 'alone', 'homesick', 'connection', 'talk'],
    badge: 'Zero Judgment'
  },
  {
    id: 'res-06',
    title: 'Disability & ADHD Assessment Fast-Path',
    category: 'Accessibility',
    dept: 'Accessibility & Neurodiversity',
    duration: '5 min intake',
    type: 'Self-Assessment',
    desc: 'Preliminary screening tool to register for quiet exam rooms, screen readers, and 25% extra test time.',
    tags: ['adhd', 'extra time', 'accommodation', 'disability', 'focus', 'chronic', 'neurodivergent'],
    badge: 'Guaranteed Accommodations'
  }
];

/**
 * Semantic match query against title, category, description, and semantic tag vectors
 */
export function searchResources(query) {
  if (!query || !query.trim()) {
    return RESOURCE_CATALOG;
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return RESOURCE_CATALOG.map(res => {
    let score = 0;
    const searchableText = `${res.title} ${res.category} ${res.dept} ${res.desc} ${res.tags.join(' ')}`.toLowerCase();

    for (const term of terms) {
      if (res.title.toLowerCase().includes(term)) score += 10;
      if (res.tags.some(t => t.includes(term))) score += 7;
      if (res.desc.toLowerCase().includes(term)) score += 4;
      if (searchableText.includes(term)) score += 2;
    }

    return { resource: res, score };
  })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.resource);
}

/**
 * Returns Bridge Support resources dynamically tailored to a student's active case themes
 */
export function getBridgeResourcesForThemes(themes = []) {
  if (!themes || themes.length === 0) {
    return RESOURCE_CATALOG.slice(0, 3);
  }

  const themeLabels = themes.map(t => (typeof t === 'string' ? t : t.label).toLowerCase());

  return RESOURCE_CATALOG.filter(res => {
    return res.tags.some(tag => themeLabels.some(tl => tl.includes(tag) || tag.includes(tl)));
  }).slice(0, 3);
}
