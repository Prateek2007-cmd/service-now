// Waitlist & Swap Routes for HERE Platform
import express from 'express';
import { find, insert } from '../../database/db.js';
import { acceptWaitlistSwap } from '../services/appointments/waitlistSwapService.js';

const router = express.Router();

// GET /api/waitlist
router.get('/', (req, res) => {
  const list = find('waitlist');
  res.json(list);
});

// POST /api/waitlist/join
router.post('/join', (req, res) => {
  const { studentId, studentName, department, urgency, preferredPeriod, caseId } = req.body;
  const entry = {
    id: `WAIT-${Date.now().toString().slice(-4)}`,
    studentId: studentId || 'STU-88219',
    studentName: studentName || 'Aarav Sharma',
    department: department || 'Counselling & Mental Wellbeing',
    urgency: urgency || 'AMBER',
    preferredPeriod: preferredPeriod || 'afternoon',
    caseId,
    joinedAt: new Date().toISOString(),
    status: 'waiting'
  };
  insert('waitlist', entry);
  res.status(201).json(entry);
});

// POST /api/waitlist/accept
router.post('/accept', (req, res) => {
  const { waitlistId, acceptSwap } = req.body;
  const result = acceptWaitlistSwap(waitlistId, acceptSwap !== false);
  if (!result) return res.status(404).json({ error: 'Waitlist entry or offer not found' });
  res.json(result);
});

export default router;
