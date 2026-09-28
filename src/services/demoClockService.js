// Simulated clock.
//
// The problem this solves: the post-session feedback loop is triggered by a
// counsellor closing a session, which means a session has to have HAPPENED. In
// a demo you cannot wait until tomorrow, so the whole feature is undemonstrable
// and looks like it does nothing.
//
// This is a time OFFSET, not a replacement for Date. Everything else in the app
// still calls Date.now() as normal; only code that needs to reason about
// "has this session passed yet" reads demoNow(). That keeps the blast radius
// small and means clearing the offset restores real time exactly.

const OFFSET_KEY = 'HERE_DEMO_CLOCK_OFFSET_V1';

let offsetMs = 0;
const listeners = new Set();

function readOffset() {
  try {
    const raw = localStorage.getItem(OFFSET_KEY);
    offsetMs = raw ? Number(raw) || 0 : 0;
  } catch (e) {
    offsetMs = 0;
  }
  return offsetMs;
}

function writeOffset(next) {
  offsetMs = next;
  try {
    localStorage.setItem(OFFSET_KEY, String(offsetMs));
  } catch (e) {
    /* non-fatal */
  }
  listeners.forEach((l) => {
    try {
      l(offsetMs);
    } catch (e) {
      console.error('Demo clock listener error:', e);
    }
  });
}

export function subscribeDemoClock(listener) {
  readOffset();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Real wall-clock time. Unaffected by simulation. */
export function realNow() {
  return Date.now();
}

/** The time the app should treat as "now", including any simulation offset. */
export function demoNow() {
  return Date.now() + offsetMs;
}

export function getOffset() {
  return offsetMs;
}

export function isSimulating() {
  return offsetMs !== 0;
}

/** Moves simulated time forward (or back) by a number of days. */
export function advanceDays(days) {
  writeOffset(offsetMs + days * 86400000);
  return offsetMs;
}

export function advanceHours(hours) {
  writeOffset(offsetMs + hours * 3600000);
  return offsetMs;
}

/** Returns to real time. */
export function resetClock() {
  writeOffset(0);
  return offsetMs;
}

/** Jumps to just after a given ISO timestamp, so a session reads as delivered. */
export function jumpTo(iso) {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return offsetMs;
  // +1 hour so the session counts as in the past rather than exactly now.
  writeOffset(target + 3600000 - Date.now());
  return offsetMs;
}

/**
 * Parses the prototype's human-readable appointment dates ("Wednesday, Oct 28")
 * into a timestamp in the current simulated year, so "has this passed?" can be
 * answered. Returns null when the string cannot be parsed, and callers must
 * treat null as "unknown" rather than guessing.
 */
export function parseAppointmentDate(dateStr, timeStr) {
  if (!dateStr) return null;
  const base = new Date(demoNow());

  // Try a real date first (e.g. "2026-10-28").
  let year = base.getFullYear();
  let month = base.getMonth();
  let day = base.getDate();

  const withYear = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (withYear) {
    year = Number(withYear[1]);
    month = Number(withYear[2]) - 1;
    day = Number(withYear[3]);
  } else {
    const monthMatch = dateStr.match(/([A-Za-z]{3,})\w*\s+(\d{1,2})/);
    if (!monthMatch) return null;
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const mi = monthNames.indexOf(monthMatch[1].slice(0, 3).toLowerCase());
    if (mi === -1) return null;
    month = mi;
    day = Number(monthMatch[2]);
  }

  let hours = 9;
  let minutes = 0;
  if (timeStr) {
    const t = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (t) {
      hours = Number(t[1]);
      minutes = Number(t[2]);
      const mer = (t[3] || '').toUpperCase();
      if (mer === 'PM' && hours !== 12) hours += 12;
      if (mer === 'AM' && hours === 12) hours = 0;
    }
  }

  return new Date(year, month, day, hours, minutes, 0, 0).getTime();
}

/**
 * Has the given appointment's session already happened, according to the
 * simulated clock? Returns null when the date cannot be parsed, so callers can
 * distinguish "not yet" from "unknown".
 */
export function hasSessionPassed(appointment) {
  if (!appointment) return null;
  if (appointment.status === 'completed') return true;
  if (appointment.status === 'cancelled') return null;
  const ts = parseAppointmentDate(appointment.date, appointment.time);
  if (ts === null) return null;
  return demoNow() > ts;
}

/** Human label for the current simulated time, for the demo panel. */
export function describeClock() {
  if (!isSimulating()) return 'Real time';
  const days = Math.round(offsetMs / 86400000);
  const hours = Math.round((offsetMs % 86400000) / 3600000);
  const parts = [];
  if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours) parts.push(`${hours}h`);
  return `+${parts.join(' ')} ahead`;
}
