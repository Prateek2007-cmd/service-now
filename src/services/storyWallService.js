// Anonymous Story Wall — community storytelling with real persistence
// Students can post with their name or stay fully anonymous. Stories are stored
// locally, moderated with a simple blocklist, and can be reacted to with "me too".

const STORAGE_KEY = 'HERE_STORY_WALL_V1';
const SEED_KEY = 'HERE_STORY_WALL_SEEDED_V1';

const TAGS = {
  academic: { label: 'Academic Pressure', color: '#8EDCF2' },
  wellbeing: { label: 'Mental Wellbeing', color: '#F4B6D7' },
  financial: { label: 'Money & Rent', color: '#EBA756' },
  isolation: { label: 'Isolation & Belonging', color: '#C7B8F5' },
  family: { label: 'Family & Home', color: '#F5BE7B' },
  health: { label: 'Health & Neurodiversity', color: '#8DCFA9' },
  advocacy: { label: 'Speaking Up', color: '#FCA5A5' },
};

export const STORY_TAGS = TAGS;

const SEED_STORIES = [
  {
    id: 'SEED-1',
    alias: 'Maya L.',
    program: '3rd Year Architecture',
    tag: 'academic',
    anonymous: false,
    createdAt: '2026-09-12T09:00:00Z',
    reactions: 47,
    body:
      "I was convinced I was going to fail out in my third year. I couldn't get out of bed for seminars. HERE connected me with Dr. Sarah within 24 hours, secured a retroactive coursework pause, and helped me reset without shame.",
    outcome: 'Completed the term with a 3.7 GPA and a routine I actually keep.',
  },
  {
    id: 'SEED-2',
    alias: 'Anonymous',
    program: '2nd Year Computer Science',
    tag: 'financial',
    anonymous: true,
    createdAt: '2026-09-15T14:30:00Z',
    reactions: 89,
    body:
      "When my father was hospitalized back home I lost my living allowance overnight. I was two days from eviction. Within 48 hours HERE processed an emergency discretionary grant and loaded food voucher credits to my student ID.",
    outcome: '$1,200 emergency bursary, zero loan debt, and nobody in my cohort ever found out.',
  },
  {
    id: 'SEED-3',
    alias: 'Chloe H.',
    program: '1st Year Biomedicine',
    tag: 'advocacy',
    anonymous: false,
    createdAt: '2026-09-18T11:15:00Z',
    reactions: 34,
    body:
      "As a first-gen student I had no idea what 'mitigating circumstances' even meant. I thought university was just sink or swim. HERE spoke to me like a caring human being, not an administrative manual.",
    outcome: 'Paired with a peer mentor and a study coach I still meet weekly.',
  },
  {
    id: 'SEED-4',
    alias: 'Anonymous',
    program: '4th Year Fine Art',
    tag: 'isolation',
    anonymous: true,
    createdAt: '2026-09-20T20:05:00Z',
    reactions: 112,
    body:
      "I posted in the anonymous listening circle at 2am because I genuinely had nobody. Nobody knew my name, nobody knew my program, and I still wasn't a statistic to them. I stayed on the call for an hour. I am not fine yet, but I am not alone in it either.",
    outcome: 'Still going to the Thursday circle. It is the only reason I left my studio this term.',
  },
  {
    id: 'SEED-5',
    alias: 'Devon R.',
    program: '2nd Year Mechanical Engineering',
    tag: 'health',
    anonymous: false,
    createdAt: '2026-09-22T16:40:00Z',
    reactions: 58,
    body:
      "I have ADHD and had spent two years silently struggling in every exam hall. HERE got my extra-time provision and a private room arranged in a week. The part that mattered most was that someone believed me before I had any paperwork.",
    outcome: 'Formal accommodations locked in for the rest of my degree.',
  },
  {
    id: 'SEED-6',
    alias: 'Anonymous',
    program: '3rd Year International Business',
    tag: 'family',
    anonymous: true,
    createdAt: '2026-09-24T08:20:00Z',
    reactions: 41,
    body:
      "My family did not know I was struggling, and I could not tell them without it becoming their crisis too. Writing this here anonymously was the first time I said any of it out loud. I did not have to perform okay for anyone.",
    outcome: 'Started a weekly check-in reminder I set up myself in Settings.',
  },
];

// Terms that must never appear in a public wall. Silent rejection, never surfaced.
const BLOCKED_PATTERNS = [
  /\b(kill|suicide|end my life|hurt myself|self[- ]harm)\b/i,
  /\b(suicidal|overdose)\b/i,
];

let cache = null;
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Error saving story wall:', e);
  }
  listeners.forEach((l) => {
    try {
      l(cache);
    } catch (e) {
      console.error('Story wall listener error:', e);
    }
  });
}

export function getStories() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw);
    } else {
      cache = JSON.parse(JSON.stringify(SEED_STORIES));
    }
  } catch (e) {
    console.error('Error loading story wall:', e);
    cache = JSON.parse(JSON.stringify(SEED_STORIES));
  }
  // Seed once only, so a user who deletes a story doesn't get it back on reload.
  try {
    if (!localStorage.getItem(SEED_KEY)) {
      localStorage.setItem(SEED_KEY, '1');
    }
  } catch (e) {
    /* storage unavailable — non-fatal */
  }
  return cache;
}

export function subscribeStories(listener) {
  getStories();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Publishes a story. Returns { ok, story } or { ok: false, error }.
 * Safety check runs before anything is written.
 */
export function publishStory({ body, alias, program, tag, anonymous }) {
  const trimmed = (body || '').trim();

  if (trimmed.length < 40) {
    return { ok: false, error: 'Give it a little more — at least 40 characters so it actually helps someone.' };
  }
  if (trimmed.length > 1200) {
    return { ok: false, error: 'That is over the 1,200 character limit. Trim it a little.' };
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        ok: false,
        error:
          'This wall is peer-to-peer, not a crisis service. If you are in danger right now, please reach the 24/7 crisis line below so a real person can help.',
      };
    }
  }
  if (!TAGS[tag]) {
    return { ok: false, error: 'Pick what this story is mostly about.' };
  }

  const stories = getStories();
  const story = {
    id: `STORY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    alias: anonymous ? 'Anonymous' : (alias || '').trim() || 'Anonymous',
    program: (program || '').trim(),
    tag,
    anonymous: !!anonymous,
    createdAt: new Date().toISOString(),
    reactions: 0,
    body: trimmed,
    outcome: '',
    mine: true,
  };

  stories.unshift(story);
  cache = stories;
  persist();
  return { ok: true, story };
}

/** Toggles a "me too" reaction. Returns the new reaction count. */
export function toggleReaction(storyId) {
  const stories = getStories();
  const target = stories.find((s) => s.id === storyId);
  if (!target) return 0;

  const key = `HERE_STORY_REACTED_${storyId}`;
  let reactedIds = [];
  try {
    reactedIds = JSON.parse(localStorage.getItem('HERE_STORY_REACTED') || '[]');
  } catch (e) {
    reactedIds = [];
  }

  if (reactedIds.includes(storyId)) {
    target.reactions = Math.max(0, target.reactions - 1);
    reactedIds = reactedIds.filter((id) => id !== storyId);
  } else {
    target.reactions += 1;
    reactedIds.push(storyId);
  }

  try {
    localStorage.setItem('HERE_STORY_REACTED', JSON.stringify(reactedIds));
    localStorage.setItem(key, reactedIds.includes(storyId) ? '1' : '0');
  } catch (e) {
    /* non-fatal */
  }

  cache = stories;
  persist();
  return target.reactions;
}

export function getReactedIds() {
  try {
    return JSON.parse(localStorage.getItem('HERE_STORY_REACTED') || '[]');
  } catch (e) {
    return [];
  }
}

export function hasReacted(storyId) {
  return getReactedIds().includes(storyId);
}

/** Removes a story the current user posted in this browser. */
export function deleteOwnStory(storyId) {
  const stories = getStories();
  const next = stories.filter((s) => !(s.id === storyId && s.mine));
  if (next.length === stories.length) return false;
  cache = next;
  persist();
  return true;
}

export function formatStoryAge(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const day = 86400000;
  if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (diff < day) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < day * 30) return `${Math.floor(diff / day)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
