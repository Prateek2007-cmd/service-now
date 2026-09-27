// Signature Feature: Waitlist Swap Engine for HERE Platform
// Automatically matches newly opened cancellation slots to eligible waiting students

import { find, findOne, update, insert } from '../../../database/db.js';

export function findEligibleWaitlistCandidates(freedSlot) {
  const waitlist = find('waitlist', w => w.status === 'waiting');
  if (!waitlist || waitlist.length === 0) return [];

  const candidates = waitlist.map(entry => {
    let score = 0;

    // 1. Department Compatibility (Max 40 pts)
    if (entry.department === freedSlot.department) {
      score += 40;
    }

    // 2. Urgency Tier (Max 30 pts)
    if (entry.urgency === 'RED') score += 30;
    else if (entry.urgency === 'AMBER') score += 20;
    else score += 10;

    // 3. Time on Waitlist (Max 20 pts)
    const hoursWaiting = (Date.now() - new Date(entry.joinedAt).getTime()) / (1000 * 60 * 60);
    score += Math.min(Math.round(hoursWaiting * 2), 20);

    // 4. Period Preference (Max 10 pts)
    if (entry.preferredPeriod && freedSlot.period === entry.preferredPeriod) {
      score += 10;
    }

    return {
      ...entry,
      matchScore: score,
      freedSlot
    };
  });

  // Sort by match score descending
  return candidates.sort((a, b) => b.matchScore - a.matchScore);
}

export function offerSlotToCandidate(waitlistId, freedSlot) {
  const entry = findOne('waitlist', waitlistId);
  if (!entry) return null;

  update('waitlist', waitlistId, {
    status: 'offered_slot',
    offeredSlot: freedSlot,
    offeredAt: new Date().toISOString()
  });

  // Create notification for student
  insert('notifications', {
    id: `NOTIF-${Date.now()}`,
    userId: entry.studentId,
    title: 'Earlier Appointment Available',
    message: `An earlier slot with ${freedSlot.counsellorName} (${freedSlot.date} at ${freedSlot.time}) has opened up. Would you like to swap?`,
    type: 'waitlist_offer',
    read: false,
    metadata: {
      slot: freedSlot,
      waitlistId
    },
    timestamp: new Date().toISOString()
  });

  return {
    candidate: entry,
    freedSlot,
    status: 'OFFER_DISPATCHED'
  };
}

export function acceptWaitlistSwap(waitlistId, acceptSwap = true) {
  const entry = findOne('waitlist', waitlistId);
  if (!entry || !entry.offeredSlot) return null;

  if (acceptSwap) {
    const slot = entry.offeredSlot;
    update('waitlist', waitlistId, {
      status: 'swapped',
      swappedSlot: slot,
      resolvedAt: new Date().toISOString()
    });

    if (entry.caseId) {
      update('cases', entry.caseId, {
        appointment: {
          id: slot.id,
          counsellor: slot.counsellorName,
          dept: slot.department,
          date: slot.date,
          time: slot.time,
          modality: slot.modality,
          status: 'confirmed'
        }
      });
    }

    return { success: true, swappedSlot: slot, message: 'Waitlist slot swap accepted successfully.' };
  } else {
    update('waitlist', waitlistId, {
      status: 'waiting',
      offeredSlot: null
    });
    return { success: true, message: 'Kept current appointment.' };
  }
}
