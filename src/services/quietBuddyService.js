// Quiet Buddy — a trusted person the student nominates to walk alongside them.
//
// Privacy model (this is the whole point of the feature, so it is enforced here
// rather than left to the UI):
//   * The buddy NEVER receives case text, symptoms, themes, urgency, department
//     diagnoses, notes, or message history.
//   * The buddy receives ONLY: the student's first name, a generic statement that
//     support was requested, appointment time + campus location, and a coarse
//     4-step milestone.
//   * The raw case object is never returned by any function in this file.
//     getBuddyView() re-derives everything from a small allowlist.

const STORAGE_KEY = 'HERE_QUIET_BUDDY_V1';

// The only four things a buddy is ever allowed to know about progress.
export const BUDDY_MILESTONES = [
  {
    id: 'requested',
    label: 'Support Requested',
    buddyLabel: 'Request received',
    blurb: 'Your buddy has been asked to walk with you.',
  },
  {
    id: 'appointment',
    label: 'Appointment Scheduled',
    buddyLabel: 'Appointment booked',
    blurb: 'A time is in the diary.',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    buddyLabel: 'Support underway',
    blurb: 'Sessions have started.',
  },
  {
    id: 'plan_active',
    label: 'Support Plan Active',
    buddyLabel: 'Ongoing plan in place',
    blurb: 'There is a plan, and it is being followed.',
  },
];

// Coarse case status -> milestone. Deliberately lossy: many case statuses collapse
// into the same milestone so the buddy cannot infer severity from the label.
const STATUS_TO_MILESTONE = [
  [/appointment|scheduled/i, 'appointment'],
  [/progress|active care|accepted|responded|assigned|review|follow/i, 'in_progress'],
];

let cache = null;
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Error saving quiet buddy state:', e);
  }
  listeners.forEach((l) => {
    try {
      l(cache);
    } catch (e) {
      console.error('Quiet buddy listener error:', e);
    }
  });
}

export function getBuddyState() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (e) {
    console.error('Error loading quiet buddy state:', e);
    cache = null;
  }
  if (!cache) {
    cache = { buddy: null, caseId: null, studentFirstName: '', reminders: [] };
  }
  return cache;
}

export function subscribeBuddy(listener) {
  getBuddyState();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function firstNameOf(name = '') {
  const part = String(name).trim().split(/\s+/)[0] || 'Your friend';
  return part;
}

/** Accepts a phone number or an email. Returns a normalised contact or an error. */
export function normaliseContact(raw) {
  const value = String(raw || '').trim();
  if (!value) return { ok: false, error: 'Add a phone number or an email address.' };

  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (email) return { ok: true, kind: 'email', value: value.toLowerCase() };

  // Permissive on separators, strict on digit count.
  const digits = value.replace(/[^\d]/g, '');
  if (digits.length >= 10 && digits.length <= 15) {
    return { ok: true, kind: 'sms', value: digits, display: formatPhone(digits) };
  }
  return {
    ok: false,
    error: 'That does not look like a phone number or email. Try 07700 900123 or name@university.edu.',
  };
}

function formatPhone(digits) {
  if (digits.length === 11 && digits.startsWith('44')) return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `+${digits}`;
}

/** Masks a contact for display, e.g. 07700 900123 -> 07700 9••123 */
function maskContact(contact) {
  if (contact.kind === 'email') {
    const [user, domain] = contact.value.split('@');
    const head = user.slice(0, 2);
    return `${head}${'•'.repeat(Math.max(2, user.length - 2))}@${domain}`;
  }
  const last3 = contact.value.slice(-3);
  return `${contact.value.slice(0, 5)}•••••${last3}`;
}

export function getRelationshipOptions() {
  return [
    { id: 'friend', label: 'A close friend' },
    { id: 'partner', label: 'My partner' },
    { id: 'family', label: 'A family member' },
    { id: 'flatmate', label: 'A flatmate' },
    { id: 'coworker', label: 'Someone from my course' },
  ];
}

/**
 * Invites a buddy. Produces the exact outbound message so the student can see
 * precisely what their friend will receive before it is sent.
 */
export function inviteBuddy({ contact, relationship = 'friend', studentName = '', studentId = '', caseId = null }) {
  const normalised = normaliseContact(contact);
  if (!normalised.ok) return normalised;

  const firstName = firstNameOf(studentName);
  const buddyFirstName = relationship === 'partner' ? 'there' : 'there';
  const buddyName = firstName;

  const message =
    `Hi! ${buddyName} has requested support through the University Wellbeing Hub and invited you as their ` +
    `Quiet Buddy. You don't need to fill out any forms - just be there to support them. ` +
    `You'll get a reminder before each appointment.`;

  const state = getBuddyState();
  state.buddy = {
    id: `BUDDY-${Date.now()}`,
    contact: { kind: normalised.kind, value: normalised.value },
    masked: maskContact(normalised),
    relationship,
    status: 'invited',
    invitedAt: new Date().toISOString(),
    messageSent: message,
  };
  state.caseId = caseId || state.caseId;
  state.studentFirstName = firstName;
  state.reminders = [];
  cache = state;
  persist();
  return { ok: true, message };
}

/** Simulates the buddy tapping the link. */
export function acceptInvite() {
  const state = getBuddyState();
  if (!state.buddy) return { ok: false, error: 'No invitation found.' };
  state.buddy.status = 'accepted';
  state.buddy.acceptedAt = new Date().toISOString();
  cache = state;
  persist();
  return { ok: true };
}

export function removeBuddy() {
  const state = getBuddyState();
  state.buddy = null;
  state.reminders = [];
  cache = state;
  persist();
  return { ok: true };
}

export function hasBuddy() {
  return !!getBuddyState().buddy;
}

/** Maps a case status string onto a buddy-safe milestone id. */
export function milestoneForCase(caseStatus = '') {
  for (const [pattern, milestone] of STATUS_TO_MILESTONE) {
    if (pattern.test(caseStatus)) return milestone;
  }
  return 'requested';
}

/**
 * THE ONLY function allowed to produce buddy-facing data.
 * Takes the full case, returns a redacted view. There is no code path from a
 * case object to a buddy beyond this allowlist.
 */
export function getBuddyView(caseObj) {
  const state = getBuddyState();
  if (!state.buddy) return null;

  const milestoneId = caseObj ? milestoneForCase(caseObj.status) : 'requested';
  const milestoneIndex = BUDDY_MILESTONES.findIndex((m) => m.id === milestoneId);

  // Only the appointment's when/where. Never the counsellor, dept, or modality,
  // which would identify a mental-health pathway.
  const appt = caseObj?.appointment;
  const safeAppointment =
    appt && appt.status !== 'cancelled'
      ? { date: appt.date, time: appt.time, location: appt.location || 'Student Union, Rm 302' }
      : null;

  return {
    studentFirstName: state.studentFirstName,
    buddyRelationship: state.buddy.relationship,
    buddyStatus: state.buddy.status,
    invitedAt: state.buddy.invitedAt,
    milestones: BUDDY_MILESTONES.map((m, i) => ({
      label: m.buddyLabel,
      state: i < milestoneIndex ? 'done' : i === milestoneIndex ? 'current' : 'upcoming',
    })),
    currentMilestone: milestoneIndex >= 0 ? BUDDY_MILESTONES[milestoneIndex] : BUDDY_MILESTONES[0],
    appointment: safeAppointment,
    reminders: state.reminders.slice(-3).reverse(),
  };
}

/** The single reminder text, reused for both student and buddy. */
export function buildReminderText({ studentFirstName, date, time, location }) {
  return `Reminder: ${studentFirstName}'s check-in is ${date?.toLowerCase?.() || 'today'} at ${time} in ${location}. Thanks for walking with them!`;
}

/**
 * Fires the coordinated reminder to BOTH parties. Called when an appointment is
 * booked. Idempotent per appointment so a re-render never double-sends.
 */
export function sendAppointmentReminders({ caseObj, studentName = '' }) {
  const state = getBuddyState();
  if (!state.buddy || state.buddy.status !== 'accepted') return { ok: false, skipped: true };

  const appt = caseObj?.appointment;
  if (!appt || appt.status === 'cancelled') return { ok: false, skipped: true };

  const already = state.reminders.some((r) => r.appointmentId === appt.id);
  if (already) return { ok: true, skipped: true, text: null };

  const location = appt.location || 'Student Union, Rm 302';
  const text = buildReminderText({
    studentFirstName: firstNameOf(studentName || state.studentFirstName),
    date: appt.date,
    time: appt.time,
    location,
  });

  state.reminders.push({
    id: `REM-${Date.now()}`,
    appointmentId: appt.id,
    text,
    sentAt: new Date().toISOString(),
    toStudent: true,
    toBuddy: true,
  });
  cache = state;
  persist();
  return { ok: true, text };
}

/** Lets the student preview what the buddy actually sees. */
export function getRedactedPreview(caseObj) {
  const view = getBuddyView(caseObj);
  if (!view) return null;
  return {
    showsFirstName: view.studentFirstName,
    showsMilestone: view.currentMilestone?.label,
    showsAppointment: view.appointment ? `${view.appointment.date} at ${view.appointment.time}` : null,
    hiddenFields: [
      'What the student said',
      'Symptoms, themes, or urgency level',
      'Which department or counsellor',
      'Session notes and messages',
      'Academic record or case number',
    ],
  };
}
