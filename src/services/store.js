// Unified State & Mock Data Store for HERE Student Support Platform
// Fully persistent via localStorage with reactive listener support

const STORAGE_KEY = 'HERE_PLATFORM_STATE_V1';

// Initial Seed Data
const INITIAL_STATE = {
  currentRole: 'student', // 'student' | 'counsellor' | 'admin'
  currentUser: {
    id: 'STU-88219',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    year: '3rd Year Undergraduate',
    department: 'School of Computer Science & Engineering',
    language: 'EN',
    preferences: {
      modality: 'Online or In-person',
      shareSummaryWithAdvisor: true,
      allowUrgentHandoff: true
    }
  },

  // 12 University Support Departments
  departments: [
    { id: 'counselling', name: 'Counselling & Mental Wellbeing', capacity: 85, activeCases: 42, waitTime: '24–48 hours', lead: 'Dr. Sarah Jenkins' },
    { id: 'academic', name: 'Academic Strategy & Tutoring', capacity: 92, activeCases: 38, waitTime: 'Same-day', lead: 'Prof. Marcus Vance' },
    { id: 'financial', name: 'Emergency Aid & Student Grants', capacity: 78, activeCases: 29, waitTime: 'Instant / 24h', lead: 'Elena Rostova' },
    { id: 'housing', name: 'Housing & International Services', capacity: 70, activeCases: 19, waitTime: '24 hours', lead: 'David Chen' },
    { id: 'accessibility', name: 'Accessibility & Neurodiversity', capacity: 88, activeCases: 24, waitTime: '48 hours', lead: 'Dr. Amara Thorne' },
    { id: 'career', name: 'Career Pathways & Internships', capacity: 95, activeCases: 15, waitTime: 'Same-day', lead: 'Jordan Miller' },
    { id: 'affairs', name: 'Student Affairs & Dean of Students', capacity: 80, activeCases: 12, waitTime: '24 hours', lead: 'Dean Richard Hayes' },
    { id: 'legal', name: 'Student Legal Clinic & Rights', capacity: 65, activeCases: 8, waitTime: '3 days', lead: 'Patricia Lopez' },
    { id: 'health', name: 'Campus Health & Primary Care', capacity: 90, activeCases: 35, waitTime: '12 hours', lead: 'Dr. Robert Kim' },
    { id: 'ombuds', name: 'University Ombudsperson', capacity: 75, activeCases: 6, waitTime: '48 hours', lead: 'Evelyn Sterling' },
    { id: 'diversity', name: 'Diversity, Equity & Belonging', capacity: 85, activeCases: 14, waitTime: '24 hours', lead: 'Maya Robinson' },
    { id: 'recreation', name: 'Mindfulness & Physical Wellbeing', capacity: 98, activeCases: 20, waitTime: 'Instant', lead: 'Coach Luke Bailey' },
  ],

  // Counsellors & Support Advisors
  counsellors: [
    {
      id: 'CNS-001',
      name: 'Dr. Sarah Jenkins',
      department: 'Counselling & Mental Wellbeing',
      specialization: 'Acute Academic Anxiety & Burnout',
      availability: 'Mon, Wed, Fri',
      currentLoad: 14,
      maxLoad: 20,
      status: 'Available',
      avatarColor: '#F4B6D7'
    },
    {
      id: 'CNS-002',
      name: 'Prof. Marcus Vance',
      department: 'Academic Strategy & Tutoring',
      specialization: 'STEM Exam De-escalation & Petitions',
      availability: 'Daily',
      currentLoad: 11,
      maxLoad: 18,
      status: 'Available',
      avatarColor: '#8EDCF2'
    },
    {
      id: 'CNS-003',
      name: 'Elena Rostova',
      department: 'Emergency Aid & Student Grants',
      specialization: 'Discretionary Hardship & Tuition Appeals',
      availability: 'Mon–Thu',
      currentLoad: 9,
      maxLoad: 15,
      status: 'Available',
      avatarColor: '#EBA756'
    },
    {
      id: 'CNS-004',
      name: 'Dr. Amara Thorne',
      department: 'Accessibility & Neurodiversity',
      specialization: 'ADHD Accommodations & Exam Modifications',
      availability: 'Tue, Thu',
      currentLoad: 12,
      maxLoad: 16,
      status: 'Available',
      avatarColor: '#8DCFA9'
    }
  ],

  // Active student cases
  cases: [
    {
      id: 'CASE-2026-00142',
      studentId: 'STU-88219',
      studentName: 'Alex Rivera',
      createdAt: '2026-09-27T10:24:00Z',
      lastUpdated: '2026-09-27T10:48:00Z',
      message: "I've been struggling with exams lately. I can't sleep properly and I'm also worried about my fees.",
      intent: 'MULTI_DEPARTMENT',
      isMultiDepartment: true,
      urgency: 'AMBER',
      confidence: 0.94,
      themes: [
        { label: 'Academic Pressure', relevance: 'High', color: '#8EDCF2' },
        { label: 'Sleep Difficulties', relevance: 'High', color: '#F4B6D7' },
        { label: 'Financial Concern', relevance: 'High', color: '#EBA756' }
      ],
      recommendedDepartments: [
        'Academic Strategy & Tutoring',
        'Counselling & Mental Wellbeing',
        'Emergency Aid & Student Grants'
      ],
      assignedCounsellor: 'Dr. Sarah Jenkins',
      status: 'In Active Care',
      studentConsent: {
        shareSummary: true,
        shareRawMessage: false,
        shareResourceHistory: true
      },
      approvedSummary: "Student reports experiencing compounding exam pressure alongside chronic sleep deprivation, compounded by financial stress regarding upcoming semester tuition fees. Requested coordinated pathway across Academic Support, Wellbeing, and Financial Aid without redundant interviews.",
      appointment: {
        id: 'APT-9041',
        counsellor: 'Dr. Sarah Jenkins',
        dept: 'Counselling & Mental Wellbeing',
        date: 'Thursday, Oct 29',
        time: '3:30 PM',
        modality: 'Confidential Video Consultation',
        status: 'confirmed'
      },
      timeline: [
        {
          id: 1,
          title: 'Request Shared in Sanctuary',
          timestamp: 'Yesterday, 10:24 AM',
          desc: 'Expressed concerns about exams, sleep, and fee deadlines.',
          status: 'completed',
          color: '#8DCFA9'
        },
        {
          id: 2,
          title: 'HERE Coordinated Tri-Department Routing',
          timestamp: 'Yesterday, 10:25 AM',
          desc: 'Unified pathway routed to Academic, Wellbeing, and Financial Aid.',
          status: 'completed',
          color: '#8DCFA9'
        },
        {
          id: 3,
          title: 'Support Pathway Selected & Confirmed',
          timestamp: 'Yesterday, 10:30 AM',
          desc: 'Student verified AI Mirror understanding and authorized summary handoff.',
          status: 'completed',
          color: '#8DCFA9'
        },
        {
          id: 4,
          title: 'Appointment Confirmed & Bridge Care Open',
          timestamp: 'Active Now',
          desc: 'Consultation set with Dr. Sarah Jenkins. 3 tailored calming resources provided while waiting.',
          status: 'active',
          color: '#EBA756'
        },
        {
          id: 5,
          title: 'Wellbeing Check-in & Follow-up',
          timestamp: 'Friday, Oct 30 · 2:00 PM',
          desc: 'Automated gentle check-in to confirm tuition appeal submission.',
          status: 'upcoming',
          color: '#78746C'
        }
      ],
      assessments: [
        {
          timestamp: '2026-09-27T10:24:00Z',
          message: "I've been struggling with exams lately. I can't sleep properly and I'm also worried about my fees.",
          urgency: 'AMBER',
          themes: ['Academic Pressure', 'Sleep Difficulties', 'Financial Concern']
        }
      ]
    },
    {
      id: 'CASE-2026-00139',
      studentId: 'STU-55421',
      studentName: 'Maya Patel',
      createdAt: '2026-09-26T14:10:00Z',
      lastUpdated: '2026-09-26T15:00:00Z',
      message: 'Need urgent accommodation letters for midterms after sudden hospitalization.',
      intent: 'ACCESSIBILITY',
      isMultiDepartment: false,
      urgency: 'AMBER',
      confidence: 0.96,
      themes: [{ label: 'Accessibility & Health', relevance: 'High', color: '#93C5FD' }],
      recommendedDepartments: ['Accessibility & Neurodiversity'],
      assignedCounsellor: 'Dr. Amara Thorne',
      status: 'Scheduled',
      studentConsent: { shareSummary: true, shareRawMessage: true },
      approvedSummary: 'Discharge papers ready, requires 2-week exam rescheduling letter for CSE convenor.',
      appointment: {
        id: 'APT-9038',
        counsellor: 'Dr. Amara Thorne',
        dept: 'Accessibility & Neurodiversity',
        date: 'Wednesday, Oct 28',
        time: '11:00 AM',
        modality: 'Campus Wellbeing Suite 204',
        status: 'confirmed'
      },
      timeline: []
    }
  ],

  // Active Waitlist Entries
  waitlist: [
    {
      id: 'WAIT-701',
      caseId: 'CASE-2026-00142',
      studentId: 'STU-88219',
      studentName: 'Alex Rivera',
      department: 'Counselling & Mental Wellbeing',
      urgency: 'AMBER',
      requestedDate: 'Oct 28',
      preferredTime: 'Morning or Early Afternoon',
      createdAt: '2026-09-27T10:35:00Z',
      status: 'active'
    },
    {
      id: 'WAIT-702',
      caseId: 'CASE-2026-00155',
      studentId: 'STU-10294',
      studentName: 'Chris Lee',
      department: 'Academic Strategy & Tutoring',
      urgency: 'GREEN',
      requestedDate: 'Oct 28',
      preferredTime: 'Anytime',
      createdAt: '2026-09-27T09:12:00Z',
      status: 'active'
    }
  ],

  // Real-time Notifications
  notifications: [
    {
      id: 'NOTIF-01',
      type: 'case_created',
      title: 'Support Pathway Activated',
      message: 'Case #CASE-2026-00142 created. Your 3 requested departments are coordinating your care.',
      timestamp: 'Yesterday',
      read: false,
      route: '/journey'
    },
    {
      id: 'NOTIF-02',
      type: 'appointment_booked',
      title: 'Appointment Reserved',
      message: 'Consultation with Dr. Sarah Jenkins confirmed for Thursday, Oct 29 at 3:30 PM.',
      timestamp: 'Yesterday',
      read: true,
      route: '/appointments'
    },
    {
      id: 'NOTIF-03',
      type: 'resource_recommendation',
      title: 'Bridge Resources Available',
      message: '3 tailored exercises (Sleep Reset & Exam Grounding) ready while you wait.',
      timestamp: '1 hour ago',
      read: false,
      route: '/resources'
    }
  ],

  // Aggregate Campus Pulse Stats (Operational anonymized metrics)
  campusPulse: {
    totalStudentsSupported: 4280,
    activeCasesToday: 184,
    avgWaitHours: 1.4,
    routingConfidence: 94.2,
    multiDeptCasesRatio: 64, // 64% of cases involve 2+ departments!
    topConcerns: [
      { concern: 'Academic & Exam Pressure', percentage: 41, trend: '+8%' },
      { concern: 'Sleep Deprivation & Burnout', percentage: 28, trend: '+12%' },
      { concern: 'Financial & Rent Insecurity', percentage: 21, trend: '+5%' },
      { concern: 'Social Isolation on Campus', percentage: 10, trend: '-2%' }
    ],
    urgencyDistribution: {
      green: 58,
      amber: 37,
      red: 5
    }
  }
};

// Global in-memory instance
let store = null;
const listeners = new Set();

export function getStore() {
  if (!store) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        store = JSON.parse(stored);
      } else {
        store = JSON.parse(JSON.stringify(INITIAL_STATE));
        saveStore();
      }
    } catch (e) {
      console.error('Error loading HERE store from localStorage:', e);
      store = JSON.parse(JSON.stringify(INITIAL_STATE));
    }
  }
  return store;
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving HERE store:', e);
  }
  notifyListeners();
}

export function subscribeStore(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  for (const listener of listeners) {
    try {
      listener(store);
    } catch (e) {
      console.error('Store listener error:', e);
    }
  }
}

// -------------------------------------------------------------
// Core Business Actions & State Mutators
// -------------------------------------------------------------

export function setRole(newRole) {
  const s = getStore();
  s.currentRole = newRole;
  saveStore();
}

export function setCurrentAuthUser(user) {
  const s = getStore();
  if (user) {
    s.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'School of Computer Science & Engineering',
      year: user.year || '3rd Year Undergraduate'
    };
    s.currentRole = user.role.toLowerCase();
  } else {
    s.currentUser = {
      id: 'GUEST',
      name: 'Guest Visitor',
      email: '',
      role: 'GUEST',
      department: 'General Studies',
      year: 'Undergraduate'
    };
    s.currentRole = 'student';
  }
  saveStore();
}

export function getCurrentCase() {
  const s = getStore();
  return s.cases.find(c => c.studentId === s.currentUser.id) || s.cases[0] || null;
}

/**
 * Creates a real Case object following NLP analysis & student confirmation
 */
export function createCaseFromAnalysis({ message, nlpResult, consent, user }) {
  const s = getStore();
  const caseNumber = Math.floor(10000 + Math.random() * 90000);
  const newCaseId = `CASE-2026-${caseNumber}`;

  const recommendedDepts = nlpResult.recommendedServices.map(svc => svc.department);
  const primaryDept = recommendedDepts[0] || 'Counselling & Mental Wellbeing';
  const assignedAdvisor = s.counsellors.find(c => c.department === primaryDept)?.name || 'Dr. Sarah Jenkins';

  const studentName = user?.name || s.currentUser.name || 'Aarav Sharma';
  const studentId = user?.id || s.currentUser.id || 'STU-88219';

  const newCase = {
    id: newCaseId,
    studentId,
    studentName,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    message,
    intent: nlpResult.intent,
    isMultiDepartment: nlpResult.isMultiDepartment,
    urgency: nlpResult.urgency,
    confidence: nlpResult.confidence,
    themes: nlpResult.themes,
    recommendedDepartments: recommendedDepts,
    assignedCounsellor: assignedAdvisor,
    status: 'Assigned to counsellor',
    studentConsent: consent || {
      shareSummary: true,
      shareRawMessage: false,
      shareResourceHistory: true
    },
    approvedSummary: nlpResult.aiMirror + ' Coordinated pathway activated across: ' + recommendedDepts.join(', ') + '.',
    appointment: null,
    messages: [
      {
        id: `MSG-${Date.now()}-1`,
        sender: 'student',
        senderName: studentName,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString()
      }
    ],
    timeline: [
      {
        id: 1,
        title: 'Request Shared in Private',
        timestamp: 'Just now',
        desc: 'Student securely initiated intake through HERE front door.',
        status: 'completed',
        color: '#8DCFA9'
      },
      {
        id: 2,
        title: 'HERE NLP Understanding & Multi-Route Formulation',
        timestamp: 'Just now',
        desc: `Analyzed themes (${nlpResult.themes.map(t => t.label).join(', ')}). Urgency categorized as ${nlpResult.urgency}.`,
        status: 'completed',
        color: '#8DCFA9'
      },
      {
        id: 3,
        title: 'Support Pathway Confirmed & Dispatched',
        timestamp: 'Active Now',
        desc: `Routed to ${recommendedDepts.join(', ')}. Assigned specialist: ${assignedAdvisor}.`,
        status: 'active',
        color: '#EBA756'
      },
      {
        id: 4,
        title: 'Counsellor Review & Consultation Plan',
        timestamp: 'Next Step',
        desc: 'Specialist reviews student-approved care summary.',
        status: 'upcoming',
        color: '#78746C'
      }
    ],
    assessments: [
      {
        timestamp: new Date().toISOString(),
        message,
        urgency: nlpResult.urgency,
        themes: nlpResult.themes.map(t => t.label)
      }
    ]
  };

  // Prepend to cases so student case is immediately at the top
  s.cases = [newCase, ...s.cases.filter(c => c.studentId !== studentId)];

  // Also add to waitlist queue
  s.waitlist.unshift({
    id: `WAIT-${Math.floor(100 + Math.random() * 900)}`,
    caseId: newCaseId,
    studentId,
    studentName,
    department: primaryDept,
    urgency: nlpResult.urgency,
    requestedDate: 'Today',
    preferredTime: 'Next available',
    createdAt: new Date().toISOString(),
    status: 'active'
  });

  // Add Notification
  s.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: 'case_created',
    title: 'Support Request Dispatched',
    message: `Case #${newCaseId} routed to ${primaryDept}. Assigned specialist: ${assignedAdvisor}.`,
    timestamp: 'Just now',
    read: false,
    route: '/journey'
  });

  // Increment campus pulse counter
  s.campusPulse.activeCasesToday += 1;

  saveStore();
  return newCase;
}

/**
 * Counsellor Action: Accept Case
 */
export function acceptCaseByCounsellor(caseId, counsellorName = 'Dr. Sarah Jenkins') {
  const s = getStore();
  const targetCase = s.cases.find(c => c.id === caseId);
  if (!targetCase) return null;

  targetCase.status = 'Accepted by counsellor';
  targetCase.assignedCounsellor = counsellorName;
  targetCase.lastUpdated = new Date().toISOString();

  targetCase.timeline.push({
    id: targetCase.timeline.length + 1,
    title: `Case Accepted by ${counsellorName}`,
    timestamp: 'Just now',
    desc: 'Counsellor reviewed approved intake summary and initiated care coordination.',
    status: 'completed',
    color: '#8DCFA9'
  });

  s.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: 'case_accepted',
    title: 'Counsellor Accepted Your File',
    message: `${counsellorName} has accepted your support file and reviewed your intake summary.`,
    timestamp: 'Just now',
    read: false,
    route: '/journey'
  });

  saveStore();
  return targetCase;
}

/**
 * Counsellor Action: Send message to student
 */
export function sendCounsellorMessage(caseId, text, counsellorName = 'Dr. Sarah Jenkins') {
  const s = getStore();
  const targetCase = s.cases.find(c => c.id === caseId);
  if (!targetCase) return null;

  if (!targetCase.messages) {
    targetCase.messages = [];
  }

  const newMsg = {
    id: `MSG-${Date.now()}`,
    sender: 'counsellor',
    senderName: counsellorName,
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString()
  };

  targetCase.messages.push(newMsg);
  targetCase.status = 'Counsellor Responded';
  targetCase.lastUpdated = new Date().toISOString();

  targetCase.timeline.push({
    id: targetCase.timeline.length + 1,
    title: `Direct Message from ${counsellorName}`,
    timestamp: 'Just now',
    desc: `"${text.trim().slice(0, 60)}..."`,
    status: 'completed',
    color: '#8DCFA9'
  });

  s.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: 'counsellor_message',
    title: 'Your Counsellor Has Replied',
    message: `${counsellorName}: "${text.trim().slice(0, 75)}..."`,
    timestamp: 'Just now',
    read: false,
    route: '/journey'
  });

  saveStore();
  return newMsg;
}

/**
 * Student Action: Reply in case thread
 */
export function sendStudentCaseMessage(caseId, text, studentName = 'Aarav Sharma') {
  const s = getStore();
  const targetCase = s.cases.find(c => c.id === caseId);
  if (!targetCase) return null;

  if (!targetCase.messages) {
    targetCase.messages = [];
  }

  const newMsg = {
    id: `MSG-${Date.now()}`,
    sender: 'student',
    senderName: studentName,
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString()
  };

  targetCase.messages.push(newMsg);
  targetCase.lastUpdated = new Date().toISOString();

  saveStore();
  return newMsg;
}

/**
 * Re-assessment: Student clicks "Something changed"
 * Runs NLP again, compares previous vs current, updates case without overwriting history!
 */
export function reassessCase(caseId, newMessage, newNlpResult) {
  const s = getStore();
  const targetCase = s.cases.find(c => c.id === caseId);
  if (!targetCase) return null;

  const previousUrgency = targetCase.urgency;
  targetCase.urgency = newNlpResult.urgency;
  targetCase.lastUpdated = new Date().toISOString();
  targetCase.themes = newNlpResult.themes;
  targetCase.recommendedDepartments = newNlpResult.recommendedServices.map(s => s.department);
  targetCase.status = newNlpResult.urgency === 'RED' ? 'Urgent Triage Required' : 'Pathway Reassessed';

  targetCase.assessments.push({
    timestamp: new Date().toISOString(),
    message: newMessage,
    urgency: newNlpResult.urgency,
    themes: newNlpResult.themes.map(t => t.label)
  });

  targetCase.timeline.push({
    id: targetCase.timeline.length + 1,
    title: `Student Reassessment (${previousUrgency} → ${newNlpResult.urgency})`,
    timestamp: 'Just now',
    desc: `Updated with new context: "${newMessage.slice(0, 70)}...". Urgency adjusted accordingly.`,
    status: 'active',
    color: newNlpResult.urgency === 'RED' ? '#F87171' : '#EBA756'
  });

  s.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: 'reassessment',
    title: 'Reassessment Recorded',
    message: `Your support coordinates were updated based on your updated situation.`,
    timestamp: 'Just now',
    read: false,
    route: '/journey'
  });

  saveStore();
  return targetCase;
}

/**
 * Books an appointment for a student
 */
export function bookAppointment({ caseId, counsellorName, dept, date, time, modality = 'Confidential Video' }) {
  const s = getStore();
  const aptId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

  const appointment = {
    id: aptId,
    caseId,
    studentId: s.currentUser.id,
    studentName: s.currentUser.name,
    counsellor: counsellorName,
    dept,
    date,
    time,
    modality,
    status: 'confirmed'
  };

  // Update target case
  const c = s.cases.find(item => item.id === caseId) || s.cases[0];
  if (c) {
    c.appointment = appointment;
    c.status = 'Appointment Scheduled';
    c.timeline.push({
      id: c.timeline.length + 1,
      title: `Appointment Confirmed with ${counsellorName}`,
      timestamp: 'Just now',
      desc: `${date} at ${time} (${modality}).`,
      status: 'completed',
      color: '#8DCFA9'
    });
  }

  // Remove from active waitlist
  s.waitlist = s.waitlist.filter(w => w.caseId !== caseId);

  s.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: 'appointment_booked',
    title: 'Appointment Confirmed',
    message: `Session booked with ${counsellorName} for ${date} at ${time}.`,
    timestamp: 'Just now',
    read: false,
    route: '/appointments'
  });

  saveStore();
  return appointment;
}

/**
 * WAITLIST SWAP ENGINE:
 * When a counsellor or admin cancels an appointment, the system immediately:
 * 1. Frees up the slot (e.g., "Today · 12:00 PM")
 * 2. Scans the waiting list for eligible students based on urgency (RED > AMBER > GREEN), service match, wait time
 * 3. Sends an immediate interactive notification to the eligible waiting student with [Accept] [Keep current]
 */
export function cancelAppointmentAndTriggerWaitlistSwap(appointmentId) {
  const s = getStore();
  let cancelledApt = null;

  for (const c of s.cases) {
    if (c.appointment && c.appointment.id === appointmentId) {
      cancelledApt = { ...c.appointment };
      c.appointment.status = 'cancelled';
      c.timeline.push({
        id: c.timeline.length + 1,
        title: 'Appointment Slot Cancelled',
        timestamp: 'Just now',
        desc: `Slot on ${cancelledApt.date} at ${cancelledApt.time} was opened.`,
        status: 'cancelled',
        color: '#94A3B8'
      });
      break;
    }
  }

  if (!cancelledApt) {
    cancelledApt = {
      id: appointmentId,
      date: 'Today',
      time: '12:00 PM',
      dept: 'Counselling & Mental Wellbeing',
      counsellor: 'Dr. Sarah Jenkins'
    };
  }

  // Find eligible waiting student (prioritize AMBER/RED or current active student)
  const candidate = s.waitlist[0] || {
    caseId: s.cases[0]?.id || 'CASE-2026-00142',
    studentId: s.currentUser.id,
    studentName: s.currentUser.name
  };

  // Generate Waitlist Swap Notification
  const swapNotif = {
    id: `WAITLIST-SWAP-${Date.now()}`,
    type: 'waitlist_offer',
    title: '⚡ Earlier Appointment Available!',
    message: `A slot with ${cancelledApt.counsellor} just opened up: Today · 12:00 PM. Would you like to take this earlier time?`,
    timestamp: 'Just now',
    read: false,
    offerData: {
      counsellor: cancelledApt.counsellor,
      date: 'Today',
      time: '12:00 PM',
      dept: cancelledApt.dept,
      targetCaseId: candidate.caseId
    }
  };

  s.notifications.unshift(swapNotif);
  saveStore();
  return swapNotif;
}

/**
 * Student accepts earlier waitlist offer
 */
export function acceptWaitlistOffer(notificationId) {
  const s = getStore();
  const notif = s.notifications.find(n => n.id === notificationId);
  if (!notif || !notif.offerData) return false;

  const { targetCaseId, counsellor, date, time, dept } = notif.offerData;
  const targetCase = s.cases.find(c => c.id === targetCaseId) || s.cases[0];

  if (targetCase) {
    targetCase.appointment = {
      id: `APT-SWAP-${Date.now()}`,
      caseId: targetCase.id,
      studentId: s.currentUser.id,
      studentName: s.currentUser.name,
      counsellor,
      dept,
      date,
      time,
      modality: 'Confidential Consultation (Waitlist Swap)',
      status: 'confirmed'
    };

    targetCase.timeline.push({
      id: targetCase.timeline.length + 1,
      title: 'Waitlist Swap Accepted ⚡',
      timestamp: 'Just now',
      desc: `Moved up to earlier slot: ${date} at ${time} with ${counsellor}.`,
      status: 'completed',
      color: '#8DCFA9'
    });
  }

  notif.read = true;
  notif.accepted = true;

  // Confirmation notification
  s.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: 'appointment_updated',
    title: 'Journey Updated with Earlier Time',
    message: `Your consultation has been rescheduled to Today · 12:00 PM.`,
    timestamp: 'Just now',
    read: false,
    route: '/journey'
  });

  saveStore();
  return true;
}

/**
 * Student declines earlier waitlist offer
 */
export function declineWaitlistOffer(notificationId) {
  const s = getStore();
  const notif = s.notifications.find(n => n.id === notificationId);
  if (notif) {
    notif.read = true;
    notif.declined = true;
  }
  saveStore();
  return true;
}

export function markNotificationRead(notifId) {
  const s = getStore();
  const n = s.notifications.find(item => item.id === notifId);
  if (n) {
    n.read = true;
    saveStore();
  }
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  store = JSON.parse(JSON.stringify(INITIAL_STATE));
  saveStore();
  return store;
}
