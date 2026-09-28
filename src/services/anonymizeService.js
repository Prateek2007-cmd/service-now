// Student identity masking for counsellor-facing surfaces.
//
// A counsellor should work from what a student has disclosed, not from who
// they are. These surfaces therefore show a stable per-case alias instead of
// the student's name and ID.
//
// The alias is derived from the case ID, so the same case always renders the
// same alias across renders and sessions. A counsellor who sees "Student
// C-4821" twice must recognise it as the same person, otherwise the alias
// defeats its own purpose and starts to look like a bug.

const ADJECTIVES = [
  'Quiet', 'Steady', 'Brave', 'Gentle', 'Calm', 'Bright', 'Kind', 'Open',
  'Warm', 'Clear', 'Steady', 'Patient', 'Gentle', 'Honest', 'Brave', 'Quiet'
];

/**
 * Deterministic 32-bit hash. Small, dependency-free, and stable across runs —
 * unlike Object hash codes or anything derived from insertion order.
 */
function hashCode(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Stable pseudonym for a case, e.g. "Student C-4821".
 * Derived from the case ID so it never changes for a given case.
 */
export function getCaseAlias(caseId) {
  if (!caseId) return 'Student';
  const h = hashCode(String(caseId));
  const adjective = ADJECTIVES[h % ADJECTIVES.length];
  const number = 1000 + (h % 9000);
  return `Student ${adjective} C-${number}`;
}

/**
 * Mask a student ID, e.g. STU-88219 -> STU-•••19.
 * Keeps a minimal correlation handle so staff can verify identity through the
 * proper channel, without the full identifier sitting on screen.
 */
export function maskStudentId(studentId) {
  if (!studentId) return 'ID withheld';
  const s = String(studentId);
  if (s.length <= 4) return '••••';
  return `${s.slice(0, 3)}-${'•'.repeat(Math.max(2, s.length - 5))}${s.slice(-2)}`;
}

/**
 * The full set of identity fields for a case, already masked.
 * One call site per surface keeps the masking consistent and auditable.
 */
export function anonymizeCase(c) {
  if (!c) return null;
  return {
    alias: getCaseAlias(c.id),
    maskedId: maskStudentId(c.studentId),
    // First name only, for the moments where a counsellor genuinely needs a
    // form of address in conversation. Never the full name.
    firstName: String(c.studentName || '').trim().split(/\s+/)[0] || 'there'
  };
}
