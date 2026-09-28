// Grounded replies.
//
// The problem this fixes: replies were chosen by keyword alone, so a student
// talking about eviction was told "financial stress makes focusing on classes
// harder" — inventing coursework they never mentioned. The student experiences
// that as the bot not listening, which is the exact opposite of what a first
// disclosure needs.
//
// Rule: a reply may only reference a domain the student has actually raised.
// The acknowledgement quotes the student's own words back. If nothing was
// raised yet, the reply asks rather than assumes.

import { getCurrentCase, getContinuityContext } from './store.js';

const DOMAINS = [
  {
    id: 'academics',
    test: /\b(exam|module|coursework|assignment|deadline|revision|revise|grade|gpa|dissertation|study|studies|lectures?|tutor|marks?|seminar)\b/i,
  },
  {
    id: 'finance',
    test: /\b(money|cash|rent|evict|landlord|bills?|afford|grocer|loan|debt|fee|tuition|bursar|grant|eviction|food)\b/i,
  },
  {
    id: 'sleep',
    test: /\b(sleep|sleeping|insomnia|tired|exhausted|awake|night|restless|fatigue|energy)\b/i,
  },
  {
    id: 'isolation',
    test: /\b(lonely|loneliness|alone|isolated|no friends|nobody|no one|disconnected|withdrawn|stuck in)\b/i,
  },
  {
    id: 'family',
    test: /\b(family|mum|mom|mother|dad|father|parents|homesick|abroad|international|overseas|back home)\b/i,
  },
  {
    id: 'health',
    test: /\b(adhd|autis|dyslex|anxiety|depress|panic|ill|illness|sick|health|diagnosis|neurodiverg|medication)\b/i,
  },
  {
    id: 'advocacy',
    test: /\b(unfair|discriminat|harass|bully|bullied|complain|ombuds|grievance)\b/i,
  },
];

function detectDomains(text) {
  return DOMAINS.filter((d) => d.test.test(text || '')).map((d) => d.id);
}

/** Pulls the student's own words into a short, quotable fragment. */
function fragment(text, max = 72) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;
  // Prefer to cut at a clause boundary so it reads like speech, not a truncation.
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(', '), cut.lastIndexOf('. '), cut.lastIndexOf(' and '));
  return `${(stop > 40 ? cut.slice(0, stop) : cut).trim()}…`;
}

const ACKS = {
  academics: ['That sounds genuinely hard.', 'That is a lot to be carrying.', 'That makes sense.'],
  finance: ['That is a lot of pressure to sit with.', 'That sounds frightening.', 'That is not a small thing.'],
  sleep: ['That takes a real toll.', 'Running on empty like that is exhausting.', 'That is a hard way to get through each day.'],
  isolation: ['That is a really lonely place to be.', 'That sounds heavy.', 'I am sorry it feels so separate.'],
  family: ['That is a lot to carry from a distance.', 'Missing people is a real weight.', 'That is not an easy thing to hold.'],
  health: ['That is worth taking seriously.', 'That sounds draining.', 'Living with that takes real effort.'],
  advocacy: ['That should not be how it is.', 'That is not okay.', 'You should not have to absorb that.'],
};

/** The "tell me more" follow-up, chosen only from domains actually raised. */
const FOLLOW_UPS = {
  academics: [
    'What does that look like day to day for you right now?',
    'How much is on your plate at the moment?',
  ],
  finance: [
    'What is the most pressing piece of that?',
    'How close is it to becoming urgent?',
  ],
  sleep: [
    'How many nights a week is it happening?',
    'What happens when you lie down at night?',
  ],
  isolation: [
    'Who is around you at the moment, if anyone?',
    'When did you last feel properly connected to someone?',
  ],
  family: [
    'How are things at home right now?',
    'Do they know you are struggling?',
  ],
  health: [
    'What does it stop you doing?',
    'Are you getting any support for it currently?',
  ],
  advocacy: [
    'What has happened so far?',
    'Has anyone official been told yet?',
  ],
};

/** A gentle opener used when nothing specific has been raised yet. */
const OPENERS = [
  'Take your time. What has been going on?',
  'You can start anywhere. What feels heaviest right now?',
  'What brought you here today?',
  'Whenever you are ready — what is going on?',
];

/**
 * Produces a reply that references the student's own words and only domains
 * they raised themselves.
 */
export function groundedReply({ recentUserMessages = [], domains = null } = {}) {
  const latest = recentUserMessages[recentUserMessages.length - 1]?.text || '';
  const raised = domains || detectDomains(latest);

  // Nothing specific raised yet: ask rather than assume.
  if (raised.length === 0) {
    return {
      text: OPENERS[Math.floor(Math.random() * OPENERS.length)],
      domains: [],
      grounded: false,
    };
  }

  const primary = raised[0];
  const acks = ACKS[primary] || ['That sounds hard.'];
  const followUps = FOLLOW_UPS[primary] || ['Tell me more about that.'];

  const ack = acks[Math.floor(Math.random() * acks.length)];
  const followUp = followUps[Math.floor(Math.random() * followUps.length)];

  // Echo their words when there's something short enough to quote cleanly.
  const quote = fragment(latest, 60);
  const canEcho = quote.length > 12 && quote.length < 70 && !/\?\s*$/.test(quote);

  const lines = [];
  lines.push(canEcho ? `${ack} When you say "${quote}", that sounds like a lot.` : ack);
  lines.push('');
  lines.push(followUp);

  return { text: lines.join('\n'), domains: raised, grounded: true };
}

/**
 * An opening that acknowledges prior work. Used when a returning student
 * reopens the chat, so continuity is visible from the first message rather than
 * being buried in a summary later.
 */
export function continuityOpener() {
  let currentCase;
  try {
    currentCase = getCurrentCase();
  } catch (e) {
    return null;
  }
  if (!currentCase) return null;

  const cont = getContinuityContext(currentCase);
  if (!cont.hasHistory) return null;

  const note = cont.lastReview ? cont.lastReview.title.replace('Session review · ', '') : null;
  const savedNote = currentCase.appointment?.sessionOutcome?.answers?.note;

  const parts = [];
  parts.push(
    cont.sessionCount === 1
      ? 'Good to see you back.'
      : `Good to see you back — this is session ${cont.sessionCount + 1} on our side.`
  );

  if (note) {
    parts.push(`Last time you said it ${note.toLowerCase()}.`);
  }
  if (savedNote) {
    parts.push(`You also wrote: "${savedNote}" — I still have that.`);
  }

  parts.push('You do not need to start again.');
  return parts.join(' ');
}

export { detectDomains };
