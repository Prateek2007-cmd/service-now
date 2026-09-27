// Counsellor Portal Routes for HERE Platform
import express from 'express';
import { find, findOne, update } from '../../database/db.js';
import { createNotification } from '../services/notifications/notificationService.js';

const router = express.Router();

// GET /api/counsellor/cases
router.get('/cases', (req, res) => {
  const counsellorName = req.query.name || 'Dr. Sarah Jenkins';
  const allCases = find('cases');
  res.json(allCases);
});

// POST /api/counsellor/cases/:id/accept
router.post('/cases/:id/accept', (req, res) => {
  const caseId = req.params.id;
  const currentCase = findOne('cases', caseId);
  if (!currentCase) return res.status(404).json({ error: 'Case not found' });

  const updated = update('cases', caseId, {
    status: 'COUNSELLOR_ACCEPTED',
    lastUpdated: new Date().toISOString()
  });

  createNotification({
    userId: currentCase.studentId,
    title: 'Counsellor Accepted Case',
    message: `${currentCase.assignedCounsellor} has accepted your support file and reviewed your summary.`,
    type: 'case_accepted'
  });

  res.json(updated);
});

// POST /api/counsellor/cases/:id/message
router.post('/cases/:id/message', (req, res) => {
  const caseId = req.params.id;
  const { text, counsellorName = 'Dr. Sarah Jenkins' } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text is required' });

  const currentCase = findOne('cases', caseId);
  if (!currentCase) return res.status(404).json({ error: 'Case not found' });

  const newMsg = {
    id: `MSG-COUNS-${Date.now()}`,
    sender: 'counsellor',
    senderName: counsellorName,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString()
  };

  const updatedMessages = [...(currentCase.messages || []), newMsg];
  const updated = update('cases', caseId, {
    messages: updatedMessages,
    lastUpdated: new Date().toISOString()
  });

  createNotification({
    userId: currentCase.studentId,
    title: 'New Counsellor Message',
    message: `${counsellorName} sent: "${text.slice(0, 60)}..."`,
    type: 'counsellor_reply'
  });

  res.json({ message: newMsg, case: updated });
});

// POST /api/counsellor/cases/:id/appointment
router.post('/cases/:id/appointment', (req, res) => {
  const caseId = req.params.id;
  const { date, time, modality, counsellorName } = req.body;

  const currentCase = findOne('cases', caseId);
  if (!currentCase) return res.status(404).json({ error: 'Case not found' });

  const appt = {
    id: `APT-${Date.now().toString().slice(-4)}`,
    counsellor: counsellorName || currentCase.assignedCounsellor || 'Dr. Sarah Jenkins',
    dept: currentCase.assignedDepartment,
    date: date || 'Tomorrow, Oct 29',
    time: time || '3:30 PM',
    modality: modality || 'Sanctuary Suite 204 or Video',
    status: 'confirmed'
  };

  const updated = update('cases', caseId, {
    appointment: appt,
    status: 'APPOINTMENT_SCHEDULED'
  });

  createNotification({
    userId: currentCase.studentId,
    title: 'Appointment Confirmed',
    message: `Consultation confirmed with ${appt.counsellor} on ${appt.date} at ${appt.time}.`,
    type: 'appointment_confirmed'
  });

  res.json({ appointment: appt, case: updated });
});

export default router;
