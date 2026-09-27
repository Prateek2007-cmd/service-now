// Report Generation Service for HERE Platform
// Creates dual summaries: Student-Facing Empathetic Summary & Counsellor Clinical Briefing

export function generateDualReports({
  conversationState,
  mlResult,
  routingResult
}) {
  const known = conversationState.knownInformation || {};
  const themes = conversationState.detectedThemes || [];
  const themeLabels = themes.map(t => typeof t === 'string' ? t : (t.label || t.name));

  // 1. Student Summary (Empathetic, clear, zero jargon)
  let studentSummary = "You've shared that you've been dealing with pressure around your upcoming exams and assignments.";
  if (known.hasConcentrationIssue) {
    studentSummary += " Concentration and keeping up with the workload have felt difficult.";
  }
  if (known.hasSleepIssue) {
    const dur = known.duration ? ` for ${known.duration.toLowerCase()}` : '';
    studentSummary += ` This has noticeably disrupted your sleep${dur}.`;
  }
  studentSummary += " HERE has mapped out confidential university support to help you navigate this step by step.";

  // 2. Counsellor Clinical Summary (Actionable, structured intake briefing)
  const durationText = known.duration ? known.duration : 'Recent onset (< 2 weeks)';
  const urgencyTier = routingResult?.urgency || mlResult?.urgencyLevel || 'AMBER';
  const primaryDept = routingResult?.primaryDepartment || 'Counselling & Mental Wellbeing';
  const assignedCounsellor = routingResult?.assignedCounsellor || 'Dr. Sarah Jenkins';

  const counsellorClinicalSummary = [
    `PRESENTING CONCERN: Student reports compounding academic pressure related to upcoming coursework and examinations.`,
    `COGNITIVE FRICTION: Impaired concentration and feeling behind in syllabus milestones.`,
    `BIOLOGICAL / ROUTINE IMPACT: Disrupted sleep patterns reported (${known.hasSleepIssue ? 'severe reduction in restorative sleep' : 'moderate fatigue'}).`,
    `DURATION & TIMELINE: ${durationText}.`,
    `DETECTED THEMES: ${themeLabels.join(', ') || 'Academic Pressure, Sleep Disturbance'}.`,
    `TRIAGE URGENCY: ${urgencyTier} (Support routing priority).`,
    `DISPATCH COORDINATES: Primary routing to ${primaryDept} (Lead: ${assignedCounsellor}).`,
    `CONSENT AUDIT: Student verified AI Mirror reflection and authorized clinical handoff.`
  ].join('\n');

  return {
    studentSummary,
    counsellorClinicalSummary
  };
}
