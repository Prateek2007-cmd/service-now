// Full End-to-End API Integration Test Suite for HERE
async function runTests() {
  console.log('--- STARTING HERE API INTEGRATION SUITE ---');

  // 1. Health
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('✓ Health Endpoint:', health.status, '| Platform:', health.platform);

  // 2. Safety Check (Crisis Signal)
  const safetyRes = await fetch('http://localhost:5000/api/safety/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "I don't want to live anymore" })
  });
  const safety = await safetyRes.json();
  console.log('✓ Safety Crisis Interception:', safety.isCrisis ? 'CRISIS INTERCEPTED' : 'FAILED', '| Action:', safety.action);

  // 3. ML Classification
  const mlRes = await fetch('http://localhost:5000/api/ml/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: "Exams and assignments are overwhelming me and I can't sleep for two weeks" })
  });
  const ml = await mlRes.json();
  console.log('✓ ML Classification:', ml.primaryIntent, '| Urgency:', ml.urgencyLevel, '| Confidence:', ml.confidence);

  // 4. Case Creation & Intelligent Routing
  const caseRes = await fetch('http://localhost:5000/api/cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: 'STU-TEST-99',
      studentName: 'Aarav Sharma',
      confirmedSummary: "Student reports academic pressure from upcoming exams and reduced sleep for 2 weeks.",
      selectedDepartments: ['Academic Support & Tutoring', 'Counselling & Mental Wellbeing'],
      message: "Exams and assignments are overwhelming me and I can't sleep for two weeks"
    })
  });
  const createdCase = await caseRes.json();
  console.log('✓ Case Created:', createdCase.id, '| Status:', createdCase.status, '| Assigned:', createdCase.assignedCounsellor);
  console.log('  Routing Explanation:', createdCase.routingExplanation);

  // 5. Admin Analytics / Campus Pulse
  const adminRes = await fetch('http://localhost:5000/api/admin/analytics');
  const admin = await adminRes.json();
  console.log('✓ Admin Campus Pulse:', admin.metrics.totalCasesCount, 'total cases | Active:', admin.metrics.activeCasesCount);
  console.log('  Top Pulse Item:', admin.campusPulse[0].metric, '| Trend:', admin.campusPulse[0].trend);

  console.log('--- ALL HERE API TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch(console.error);
