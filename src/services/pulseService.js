// Daily Pulse — a private mood check-in the student controls
// One entry per calendar day. Nothing leaves the browser. The student can
// delete everything at any time from Settings.

const STORAGE_KEY = 'HERE_PULSE_V1';

export const PULSE_LEVELS = [
  { id: 1, label: 'Falling apart', short: 'Falling', color: '#F87171', emoji: '●' },
  { id: 2, label: 'Struggling', short: 'Struggling', color: '#FCA5A5', emoji: '●●' },
  { id: 3, label: 'Holding on', short: 'Holding', color: '#EBA756', emoji: '●●●' },
  { id: 4, label: 'Steady', short: 'Steady', color: '#8EDCF2', emoji: '●●●●' },
  { id: 5, label: 'Genuinely okay', short: 'Okay', color: '#8DCFA9', emoji: '●●●●●' },
];

// What each level quietly suggests, so the check-in is not a dead end.
export const LEVEL_NUDGE = {
  1: 'You do not have to hold this together alone. Reach the 24/7 crisis line or start a private conversation now.',
  2: 'This is the moment most people wait too long. A short conversation is usually enough to change the next week.',
  3: 'Holding on is a real achievement. One small, concrete thing today is worth more than a whole plan.',
  4: 'Steady is worth protecting. Keep whatever is currently working, and name it so you can return to it.',
  5: 'Good days are data too. Writing down what helped makes the harder weeks easier to survive.',
};

let cache = null;
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Error saving pulse entries:', e);
  }
  listeners.forEach((l) => {
    try {
      l(cache);
    } catch (e) {
      console.error('Pulse listener error:', e);
    }
  });
}

export function getEntries() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(cache)) cache = [];
  } catch (e) {
    console.error('Error loading pulse entries:', e);
    cache = [];
  }
  return cache;
}

export function subscribePulse(listener) {
  getEntries();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTodayEntry() {
  const key = todayKey();
  return getEntries().find((e) => e.date === key) || null;
}

/** Records or updates today's check-in. */
export function logPulse({ level, note = '', triggers = [] }) {
  if (!PULSE_LEVELS.some((l) => l.id === level)) {
    return { ok: false, error: 'Pick how today actually felt.' };
  }
  const entries = getEntries();
  const key = todayKey();
  const existing = entries.find((e) => e.date === key);
  const record = {
    date: key,
    level,
    note: note.trim().slice(0, 400),
    triggers,
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    Object.assign(existing, record);
  } else {
    entries.push(record);
  }

  entries.sort((a, b) => (a.date < b.date ? -1 : 1));
  cache = entries;
  persist();
  return { ok: true, entry: record };
}

export function clearAll() {
  cache = [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    /* non-fatal */
  }
  listeners.forEach((l) => l(cache));
}

/** Returns the last N days as a dense series, oldest first, with nulls for gaps. */
export function getSeries(days = 14) {
  const entries = getEntries();
  const byDate = Object.fromEntries(entries.map((e) => [e.date, e]));
  const out = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({
      date: key,
      label: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
      level: byDate[key]?.level ?? null,
      note: byDate[key]?.note ?? '',
    });
  }
  return out;
}

/** Average level and direction vs the previous half of the window. */
export function getTrend(days = 14) {
  const series = getSeries(days);
  const filled = series.filter((p) => p.level !== null);
  if (filled.length === 0) {
    return { average: null, direction: 'none', loggedDays: 0, span: 0, best: null, hardest: null };
  }

  const levels = filled.map((p) => p.level);
  const average = levels.reduce((a, b) => a + b, 0) / levels.length;

  const mid = Math.floor(series.length / 2);
  const firstHalf = series.slice(0, mid).filter((p) => p.level !== null).map((p) => p.level);
  const secondHalf = series.slice(mid).filter((p) => p.level !== null).map((p) => p.level);

  let direction = 'none';
  if (firstHalf.length >= 2 && secondHalf.length >= 1) {
    const a = firstHalf.reduce((x, y) => x + y, 0) / firstHalf.length;
    const b = secondHalf.reduce((x, y) => x + y, 0) / secondHalf.length;
    if (b - a > 0.35) direction = 'up';
    else if (a - b > 0.35) direction = 'down';
  }

  return {
    average,
    direction,
    loggedDays: filled.length,
    span: series.length,
    best: Math.max(...levels),
    hardest: Math.min(...levels),
  };
}
