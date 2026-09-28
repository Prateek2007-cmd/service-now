// Quiet Buddy accounts — a second, fully isolated identity inside the app.
//
// WHY THIS FILE EXISTS INSTEAD OF REUSING authService.js:
// Every other HERE storage key (HERE_PLATFORM_STATE_V1, HERE_CONVERSATION_STATE_V4,
// the story wall, the pulse log) is GLOBAL to the browser, not namespaced per user.
// A buddy signed in on the same machine would therefore inherit the student's entire
// case store, including raw message text. That is precisely the disclosure the
// Quiet Buddy feature exists to prevent.
//
// So the buddy identity is kept in its own keys, its own session, and its own
// render surface, and NOTHING in here ever reads a student-owned key. The buddy
// sees only what inviteBuddy() explicitly copied into the invite record.

const ACCOUNTS_KEY = 'HERE_BUDDY_ACCOUNTS_V1';
const SESSION_KEY = 'HERE_BUDDY_SESSION_V1';
const INVITES_KEY = 'HERE_BUDDY_INVITES_V1';

const listeners = new Set();

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`[buddy] failed reading ${key}:`, e);
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[buddy] failed writing ${key}:`, e);
  }
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error('[buddy] listener error:', e);
    }
  });
}

export function subscribeBuddyAccounts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------------------------------------------------------------- invites

export function getRelationshipOptions() {
  return [
    { id: 'friend', label: 'A close friend' },
    { id: 'partner', label: 'My partner' },
    { id: 'family', label: 'A family member' },
    { id: 'flatmate', label: 'A flatmate' },
    { id: 'coworker', label: 'Someone from my course' },
  ];
}

function makeCode() {
  // Ambiguous characters (0/O, 1/I) removed so codes survive being read aloud
  // or copied off a screen by someone in a hurry.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${out.slice(0, 3)}-${out.slice(3)}`;
}

function getInvites() {
  return readJson(INVITES_KEY, {});
}

export function createInvite({ studentFirstName = 'Someone', caseId = null, appointment = null, milestone = null }) {
  const invites = getInvites();
  const code = makeCode();
  // caseId is deliberately NOT stored here. This record is written to the buddy's
  // own browser, so anything kept in it is readable by the buddy. A case number is
  // a disclosure vector even without the case contents, so the link back to the
  // case is resolved server-side in a real deployment, not held client-side.
  invites[code] = {
    code,
    // Copied, not referenced. The invite record holds only these fields and is the
    // complete universe of what a buddy can ever learn.
    studentFirstName,
    appointment: appointment
      ? { date: appointment.date, time: appointment.time, location: appointment.location }
      : null,
    milestone: milestone || { label: 'Request received', state: 'current' },
    createdAt: new Date().toISOString(),
    redeemedBy: null,
    redeemedAt: null,
  };
  writeJson(INVITES_KEY, invites);
  return { code, invite: invites[code] };
}

export function peekInvite(code) {
  return getInvites()[String(code || '').trim().toUpperCase()] || null;
}

export function revokeInvite(code) {
  const invites = getInvites();
  delete invites[String(code || '').trim().toUpperCase()];
  writeJson(INVITES_KEY, invites);
  return true;
}

// ---------------------------------------------------------------- accounts

function getAccounts() {
  return readJson(ACCOUNTS_KEY, []);
}

export function createBuddyAccount({ name, email, password, code }) {
  const normalisedCode = String(code || '').trim().toUpperCase();
  const invites = getInvites();
  const invite = invites[normalisedCode];

  if (!invite) return { ok: false, error: 'That code is not recognised. Ask the person who invited you to check it.' };
  if (invite.redeemedBy) return { ok: false, error: 'That code has already been used. Each invitation works once.' };

  const normalisedEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalisedEmail)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }
  if (String(password || '').length < 8) {
    return { ok: false, error: 'Choose a password of at least 8 characters.' };
  }
  if (getAccounts().some((a) => a.email === normalisedEmail)) {
    return { ok: false, error: 'An account with that email already exists. Try signing in.' };
  }

  const account = {
    id: `BUDDY-${Date.now()}`,
    name: String(name || '').trim() || 'Quiet Buddy',
    email: normalisedEmail,
    // Prototype only: stored in plain text because this is a client-side demo
    // with no server. A real deployment must hash server-side and never keep the
    // plaintext. Noted in the UI copy.
    password,
    code: normalisedCode,
    createdAt: new Date().toISOString(),
  };

  writeJson(ACCOUNTS_KEY, [...getAccounts(), account]);

  invite.redeemedBy = account.id;
  invite.redeemedAt = new Date().toISOString();
  invites[normalisedCode] = invite;
  writeJson(INVITES_KEY, invites);

  setBuddySession(account);
  return { ok: true, account: { id: account.id, name: account.name, email: account.email } };
}

export function signInBuddy({ email, password }) {
  const normalisedEmail = String(email || '').trim().toLowerCase();
  const match = getAccounts().find((a) => a.email === normalisedEmail);
  if (!match || match.password !== password) {
    return { ok: false, error: 'That email and password do not match.' };
  }
  setBuddySession(match);
  return { ok: true, account: { id: match.id, name: match.name, email: match.email } };
}

export function signOutBuddy() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    /* non-fatal */
  }
  listeners.forEach((l) => l());
  return true;
}

function setBuddySession(account) {
  writeJson(SESSION_KEY, { id: account.id, name: account.name, email: account.email, code: account.code });
}

export function getBuddySession() {
  return readJson(SESSION_KEY, null);
}

export function getCurrentBuddy() {
  const session = getBuddySession();
  if (!session) return null;
  const account = getAccounts().find((a) => a.id === session.id);
  if (!account) return null;
  return { id: account.id, name: account.name, email: account.email, code: account.code, createdAt: account.createdAt };
}

// ---------------------------------------------------------------- reminders

// Reminders are per-buddy, keyed by their own session, not by student data.
const REMINDERS_KEY = 'HERE_BUDDY_REMINDERS_V1';

export function getBuddyReminders() {
  const session = getBuddySession();
  if (!session) return [];
  return readJson(REMINDERS_KEY, {})[session.id] || [];
}

/**
 * Queues a reminder for the buddy. Reads ONLY from the invite record, so it
 * cannot accidentally pull in a case object.
 */
export function queueBuddyReminder({ text, when }) {
  const session = getBuddySession();
  if (!session || !text) return { ok: false };

  const all = readJson(REMINDERS_KEY, {});
  const mine = all[session.id] || [];
  if (mine.some((r) => r.text === text)) return { ok: true, duplicate: true };

  all[session.id] = [
    ...mine,
    { id: `REM-${Date.now()}`, text, when: when || new Date().toISOString(), read: false },
  ];
  writeJson(REMINDERS_KEY, all);
  return { ok: true };
}

export function markBuddyRemindersRead() {
  const session = getBuddySession();
  if (!session) return;
  const all = readJson(REMINDERS_KEY, {});
  all[session.id] = (all[session.id] || []).map((r) => ({ ...r, read: true }));
  writeJson(REMINDERS_KEY, all);
}

/**
 * The ONLY function that produces buddy-facing content, and it reads solely from
 * the invite record. There is no parameter through which a case object could be
 * passed, so there is no path from student data to this surface.
 */
export function getBuddyPortalData() {
  const session = getBuddySession();
  if (!session) return null;
  const account = getAccounts().find((a) => a.id === session.id);
  const invite = account ? getInvites()[account.code] : null;
  if (!invite) return null;

  return {
    buddyName: account.name,
    studentFirstName: invite.studentFirstName,
    appointment: invite.appointment,
    milestone: invite.milestone,
    joinedAt: account.createdAt,
    reminders: getBuddyReminders(),
  };
}

/** Milestone shape for the student-side preview of the buddy portal. */
export const PORTAL_MILESTONES = [
  { id: 'requested', label: 'Request received' },
  { id: 'appointment', label: 'Appointment booked' },
  { id: 'in_progress', label: 'Support underway' },
  { id: 'plan_active', label: 'Ongoing plan in place' },
];
