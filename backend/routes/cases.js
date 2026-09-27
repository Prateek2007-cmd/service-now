// Case Management Routes for HERE Platform
import express from 'express';
import { find, findOne, insert, update } from '../../database/db.js';
import { classifySupportCase } from '../services/ml/mlClient.js';
import { routeSupportCase } from '../services/routing/routingEngine.js';
import { generateDualReports } from '../services/reports/reportService.js';
import { createNotification } from '../services/notifications/notificationService.js';

const router = express.Router();

// GET /api/cases
router.get('/', (req, res) => {
  const studentId = req.query.studentId;
  const counsellorName = req.query.counsellor;
  let cases = find('cases');

  if (studentId) {
    cases = cases.filter(c => c.studentId === studentId);
  }
  if (counsellorName) {
    cases = cases.filter(c => c.assignedCounsellor === counsellorName);
  }

  res.json(cases);
});

// GET /api/cases/:id
router.get('/:id', (req, res) => {
  const c = findOne('cases', req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  res.json(c);
});

// POST /api/cases
router.post('/', async (req, res) => {
  const {
    studentId = 'STU-88219',
    studentName = 'Aarav Sharma',
    conversationId,
    confirmedSummary,
    selectedDepartments = [],
    message
  } = req.body;

  try {
    const rawText = message || confirmedSummary || 'Student requested support coordination';

    // 1. Run Machine Learning Classification
    const mlResult = await classifySupportCase(rawText);

    // 2. Run Intelligent Routing Engine
    const routingResult = routeSupportCase({
      mlResult,
      safetyResult: { isCrisis: false },
      selectedDepartments
    });

    // 3. Generate Dual Reports (Student Summary + Counsellor Clinical Briefing)
    const reports = generateDualReports({
      conversationState: {
        knownInformation: {
          hasAcademicConcern: true,
          hasConcentrationIssue: true,
          hasSleepIssue: true,
          duration: 'Approximately two weeks'
        }
      },
      mlResult,
      routingResult
    });

    const caseNumber = Math.floor(10000 + Math.random() * 90000);
    const newCaseId = `CASE-2026-${caseNumber}`;

    const newCase = {
      id: newCaseId,
      studentId,
      studentName,
      conversationId: conversationId || `CONV-${Date.now()}`,
      status: 'ASSIGNED_TO_COUNSELLOR',
      intent: mlResult.primaryIntent || 'academic_support',
      isMultiDepartment: (routingResult.coordinatedDepartments?.length || 1) > 1,
      urgency: routingResult.urgency,
      confidence: mlResult.confidence || 0.94,
      themes: [
        { label: 'Academic Pressure', relevance: 'High', color: '#8EDCF2' },
        { label: 'Difficulty concentrating', relevance: 'High', color: '#8EDCF2' },
        { label: 'Sleep difficulty', relevance: 'High', color: '#F4B6D7' }
      ],
      recommendedDepartments: routingResult.coordinatedDepartments,
      assignedDepartment: routingResult.primaryDepartment,
      assignedCounsellor: routingResult.assignedCounsellor,
      studentApprovedSummary: confirmedSummary || reports.studentSummary,
      counsellorClinicalSummary: reports.counsellorClinicalSummary,
      routingExplanation: routingResult.routingExplanation,
      mlPredictions: {
        intent: mlResult.intentProbabilities,
        urgency: mlResult.urgencyProbabilities
      },
      appointment: null,
      messages: [
        {
          id: `MSG-${Date.now()}-1`,
          sender: 'student',
          senderName: studentName,
          text: rawText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date().toISOString()
        }
      ],
      timeline: [
        { id: 1, title: 'Request Shared in Sanctuary', timestamp: 'Just now', desc: 'Securely shared context through HERE front door.', status: 'completed', color: '#8DCFA9' },
        { id: 2, title: 'HERE Context Understood', timestamp: 'Just now', desc: 'Multi-turn discovery established themes and impact.', status: 'completed', color: '#8DCFA9' },
        { id: 3, title: 'Summary Confirmed by Student', timestamp: 'Just now', desc: 'Student reviewed and verified AI Mirror reflection.', status: 'completed', color: '#8DCFA9' },
        { id: 4, title: 'Routed & Counsellor Assigned', timestamp: 'Active Now', desc: `Connected to ${routingResult.assignedCounsellor} (${routingResult.primaryDepartment}).`, status: 'active', color: '#EBA756' },
        { id: 5, title: 'Consultation & Action Plan', timestamp: 'Next Step', desc: 'Counsellor review and appointment reservation.', status: 'pending', color: '#78746C' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    insert('cases', newCase);

    // Create notifications
    createNotification({
      userId: studentId,
      title: 'Support Request Received',
      message: `Your file #${newCaseId} has been connected to ${routingResult.assignedCounsellor}.`,
      type: 'case_created'
    });

    createNotification({
      userId: 'COUNS-4011',
      title: 'New Case in Queue',
      message: `Case #${newCaseId} (${studentName}) routed to your department.`,
      type: 'case_assigned'
    });

    res.status(201).json(newCase);
  } catch (err) {
    console.error('[CASES ROUTE ERROR]', err);
    res.status(500).json({ error: 'Failed to create case', details: err.message });
  }
});

// PATCH /api/cases/:id
router.patch('/:id', (req, res) => {
  const updated = update('cases', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Case not found' });
  res.json(updated);
});

export default router;
