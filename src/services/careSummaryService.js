// Structured care summary for the counsellor.
//
// Why this exists: the counsellor was handed `approvedSummary || c.message` — a
// flat string that was either a canned template or the student's raw first
// message. Neither is a clinical summary.
//
// The rule here: every claim in the summary must be traceable to something the
// student actually said. Claims are either QUOTED (verbatim, with a pointer to
// the message) or explicitly marked as not-stated. Nothing is inferred from
// demographics or assumed because of the department involved.

const THEME_RULES = [
  {
    id: 'academics',
    label: 'Academic pressure',
    patterns: /\b(exam|exam s|module|coursework|assignment|deadline|revision|revise|grades?|gpa|dissertation|study|studies|university|college|lectures?|tutor|marks?)\b/i,
  },
  {
    id: 'finance',
    label: 'Money & housing',
    patterns: /\b(money|cash|rent|evict|landlord|mortgage|bills?|afford|food|grocer|loan|debt|fee|tuition|bursar|grant|poor|eviction)\b/i,
  },
  {
    id: 'sleep',
    label: 'Sleep',
    patterns: /\b(sleep|sleeping|insomnia|tired|exhausted|exhaustion|awake|night|restless|fatigue|energy)\b/i,
  },
  {
    id: 'isolation',
    label: 'Isolation & belonging',
    patterns: /\b(lonely|loneliness|alone|isolated|isolating|no friends|nobody|no one|disconnected|withdrawn|left my|haven't left|stuck in)\b/i,
  },
  {
    id: 'family',
    label: 'Family & home',
    patterns: /\b(family|families|mum|mom|mother|dad|father|parents|home|homesick|abroad|international|overseas|back home)\b/i,
  },
  {
    id: 'health',
    label: 'Health & neurodiversity',
    patterns: /\b(adhd|autis|dyslex|anxiety|depress|panic|ill|illness|sick|health|diagnosis|neurodiverg|medication|therapy session)\b/i,
  },
  {
    id: 'identity',
    label: 'Identity & belonging',
    patterns: /\b(identity|race|racial|discriminat|racism|sexuality|gay|lesbian|trans|religion|faith|muslim|hindu|christian|culture|cultural|fitting in|belong)\b/i,
  },
  {
    id: 'advocacy',
    label: 'Being mistreated',
    patterns: /\b(unfair|discriminat|harass|bully|bullied|complain|ombuds|grievance|unfairly|treat(ed)? me|marked against)\b/i,
  },
];

const IMPACT_RULES = [
  { id: 'sleep', label: 'Sleep', patterns: /\b(sleep|insomnia|awake|night|tired|exhausted)\b/i },
  { id: 'eating', label: 'Eating', patterns: /\b(eat|eating|appetite|food|skipping meals|not eating)\b/i },
  { id: 'attendance', label: 'Getting to class', patterns: /\b(seminar|class|lecture|attend|skipping class|missed class|dorm|bed|leave my|leave the house)\b/i },
  { id: 'finances', label: 'Finances', patterns: /\b(money|rent|evict|bills?|afford|food|fee|loan)\b/i },
  { id: 'study', label: 'Studying', patterns: /\b(study|revise|concentrat|focus|workload|coursework|assignment|behind)\b/i },
  { id: 'relationships', label: 'Relationships', patterns: /\b(friend|isolate|alone|lonely|relationship|partner|family)\b/i },
];

const RISK_RULES = [
  {
    id: 'self_harm_language',
    label: 'Self-harm language present',
    severity: 'high',
    patterns: /\b(kill myself|hurt myself|self[- ]harm|end my life|suicid|overdose|don't want to live|want to die)\b/i,
  },
  {
    id: 'hopelessness',
    label: 'Hopelessness expressed',
    severity: 'moderate',
    patterns: /\b(no point|nothing matters|hopeless|give up|can'?t do this any ?more|trapped|alone in the world)\b/i,
  },
  {
    id: 'no_support',
    label: 'Says they have no one',
    severity: 'moderate',
    patterns: /\b(no one|nobody|no friends|on my own|by myself|nothing to talk to|no one to)\b/i,
  },
];

// Students write "three weeks", not "3 weeks". Digits alone missed most real
// phrasing, so spelled-out numbers are supported too.
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, a: 1, an: 1,
  'couple': 2, 'couple of': 2, 'few': 3, 'several': 4,
};

// "a couple of months" and "a few weeks" insert an "of", so the unit is
// allowed either directly after the number or after "of".
const NUM = String.raw`(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a|an|couple(?:\s+of)?|few)`;
const DURATION_RULES = [
  { label: 'days', patterns: new RegExp(String.raw`\b${NUM}(?:\s+of)?\s+days?\b`, 'i'), multiplier: 1 },
  { label: 'weeks', patterns: new RegExp(String.raw`\b${NUM}(?:\s+of)?\s+weeks?\b`, 'i'), multiplier: 7 },
  { label: 'months', patterns: new RegExp(String.raw`\b${NUM}(?:\s+of)?\s+months?\b`, 'i'), multiplier: 30 },
  { label: 'years', patterns: new RegExp(String.raw`\b${NUM}(?:\s+of)?\s+years?\b`, 'i'), multiplier: 365 },
];

function parseDurationValue(token) {
  const lower = String(token).toLowerCase().replace(/\s+/g, ' ').trim();
  if (/^\d+$/.test(lower)) return Number(lower);
  return NUMBER_WORDS[lower] ?? null;
}

function allUserText(convState) {
  if (!convState) return [];
  return (convState.messages || [])
    .filter((m) => m.sender === 'user' && m.text)
    .map((m) => ({ text: m.text, id: m.id, time: m.time }));
}

/** Pull a short verbatim quote as evidence. Truncated with an ellipsis. */
function quote(text, max = 130) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
}

/**
 * Builds the full structured summary.
 *
 * @param {object} convState conversation state (may be null)
 * @param {object} caseObj   the case this belongs to (may be null)
 */
export function buildCareSummary({ convState = null, caseObj = null, studentName = '' } = {}) {
  const userMessages = allUserText(convState);
  const caseMessages = (caseObj?.messages || []).filter((m) => m.sender === 'student' && m.text);
  // Prefer the conversation; fall back to what the case captured.
  const sources = userMessages.length ? userMessages : caseMessages.map((m) => ({ text: m.text, id: m.id }));
  const corpus = sources.map((s) => s.text).join(' \n ');

  // ---- Themes, each with the student's own words as evidence ---------------
  const themes = THEME_RULES.map((rule) => {
    const hits = sources.filter((s) => rule.patterns.test(s.text));
    if (hits.length === 0) return null;
    return {
      id: rule.id,
      label: rule.label,
      mentions: hits.length,
      evidence: quote(hits[0].text),
      // Weight by how often it came up, capped so one theme cannot dominate.
      weight: Math.min(hits.length, 4),
    };
  })
    .filter(Boolean)
    .sort((a, b) => b.weight - a.weight);

  // ---- Impact on daily life ----------------------------------------------
  const impact = IMPACT_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    mentioned: rule.patterns.test(corpus),
  })).filter((i) => i.mentioned);

  // ---- Risk --------------------------------------------------------------
  const risks = RISK_RULES.map((rule) => {
    if (!rule.patterns.test(corpus)) return null;
    const hit = sources.find((s) => rule.patterns.test(s.text));
    return { id: rule.id, label: rule.label, severity: rule.severity, evidence: hit ? quote(hit.text) : '' };
  }).filter(Boolean);

  // ---- Duration, only if they actually said one --------------------------
  let duration = null;
  for (const rule of DURATION_RULES) {
    const m = corpus.match(rule.patterns);
    if (m) {
      const parsed = parseDurationValue(m[1]);
      if (parsed === null) continue;
      const value = parsed * rule.multiplier;
      if (Number.isFinite(value) && value > 0 && value < 365 * 5) {
        duration = { text: m[0].trim(), approximateDays: value };
        break;
      }
    }
  }

  // ---- Continuity from the case ------------------------------------------
  const timeline = caseObj?.timeline || [];
  const delivered = timeline.filter((t) => t.kind === 'session_delivered' && t.status === 'completed');
  const reviews = timeline.filter((t) => t.kind === 'session_review');
  const lastReview = reviews.length ? reviews[reviews.length - 1] : null;
  const outcome = caseObj?.appointment?.sessionOutcome || null;

  // ---- What the student asked for, in their words ------------------------
  const askedFor = sources
    .filter((s) => /\b(help|need|want|looking for|could you|can you|advice|support|someone to talk)\b/i.test(s.text))
    .slice(0, 2)
    .map((s) => quote(s.text, 100));

  // ---- Student's own words: the most load-bearing section ----------------
  const inTheirWords = sources.slice(-3).map((s) => ({
    text: quote(s.text, 180),
    time: s.time || null,
  }));

  // ---- One-line presenting concern, built only from what was said --------
  let presentingConcern = 'Not enough has been shared yet to summarise.';
  if (themes.length) {
    const top = themes.slice(0, 2).map((t) => t.label.toLowerCase());
    presentingConcern =
      top.length === 1
        ? `Student presenting with ${top[0]}.`
        : `Student presenting with ${top[0]} alongside ${top[1]}.`;
  }

  return {
    studentName: studentName || caseObj?.studentName || convState?.studentName || 'Student',
    presentingConcern,
    messageCount: sources.length,
    hasEnoughToSummarise: sources.length >= 2 && themes.length > 0,

    themes,
    impact,
    duration,
    risks,

    inTheirWords,
    askedFor,

    continuity: {
      priorSessions: delivered.length,
      reviewsGiven: reviews.length,
      lastReviewTone: lastReview ? lastReview.color : null,
      lastReviewLabel: lastReview ? lastReview.title.replace('Session review · ', '') : null,
      lastSessionNote: outcome?.answers?.note || caseObj?.appointment?.sessionNote || '',
      hasHistory: delivered.length > 0,
    },

    // Explicitly flag what the student did NOT say, so nobody fills the gap
    // with assumption. This is the difference between a summary and a guess.
    notStated: {
      duration: !duration,
      risk: risks.length === 0,
      detail: sources.length < 3,
    },
  };
}

/** The plain-text version, for the existing `approvedSummary` field. */
export function summaryToText(summary) {
  if (!summary?.hasEnoughToSummarise) {
    return summary?.inTheirWords?.length
      ? `Student raised: "${summary.inTheirWords[summary.inTheirWords.length - 1].text}"`
      : 'Insufficient detail shared to summarise.';
  }
  const parts = [summary.presentingConcern];
  if (summary.duration) parts.push(`Ongoing ${summary.duration.text}.`);
  if (summary.themes.length) {
    parts.push(`Themes: ${summary.themes.map((t) => t.label).join(', ')}.`);
  }
  if (summary.continuity.hasHistory) {
    const n = summary.continuity.priorSessions;
    parts.push(
      `Returning student — ${n} prior session${n === 1 ? '' : 's'}${
        summary.continuity.lastReviewLabel ? `, last review "${summary.continuity.lastReviewLabel}"` : ''
      }.`
    );
  }
  if (summary.continuity.lastSessionNote) {
    parts.push(`Student note from last review: "${summary.continuity.lastSessionNote}"`);
  }
  return parts.join(' ');
}
