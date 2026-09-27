// Appointment Routes for HERE Platform
import express from 'express';
import { getAvailableAppointments, bookAppointment, cancelAppointment } from '../services/appointments/appointmentService.js';
import { findEligibleWaitlistCandidates, offerSlotToCandidate } from '../services/appointments/waitlistSwapService.js';

const router = express.Router();

// GET /api/appointments/available
router.get('/available', (req, res) => {
  const dept = req.query.department;
  const slots = getAvailableAppointments(dept);
  res.json(slots);
});

// POST /api/appointments/book
router.post('/book', (req, res) => {
  const { caseId, studentId, slotId, counsellorName, dept, date, time, modality } = req.body;
  try {
    const appt = bookAppointment({
      caseId,
      studentId: studentId || 'STU-88219',
      slotId,
      counsellorName,
      dept,
      date,
      time,
      modality
    });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment', details: err.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', (req, res) => {
  const cancelled = cancelAppointment(req.params.id);
  if (!cancelled) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Signature Waitlist Swap Scan
  const candidates = findEligibleWaitlistCandidates(cancelled);
  let swapOffer = null;
  if (candidates.length > 0) {
    swapOffer = offerSlotToCandidate(candidates[0].id, cancelled);
  }

  res.json({
    cancelledAppointment: cancelled,
    waitlistSwapTriggered: Boolean(swapOffer),
    swapCandidate: candidates[0] || null
  });
});

export default router;
