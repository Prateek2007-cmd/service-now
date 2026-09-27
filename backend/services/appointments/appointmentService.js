// Appointment Management Service for HERE Platform
import { find, findOne, insert, update } from '../../../database/db.js';

export function getAvailableAppointments(department = null) {
  const all = find('appointments', a => a.status === 'available');
  if (!department) return all;
  return all.filter(a => a.department.toLowerCase().includes(department.toLowerCase()));
}

export function bookAppointment({
  caseId,
  studentId,
  slotId,
  counsellorName,
  dept,
  date,
  time,
  modality
}) {
  const existingSlot = findOne('appointments', slotId);
  if (existingSlot) {
    update('appointments', slotId, {
      status: 'booked',
      caseId,
      studentId
    });
  }

  const apptRecord = {
    id: `APT-${Date.now().toString().slice(-4)}`,
    caseId,
    studentId,
    counsellorName: counsellorName || existingSlot?.counsellorName || 'Dr. Sarah Jenkins',
    department: dept || existingSlot?.department || 'Counselling & Mental Wellbeing',
    date: date || existingSlot?.date || 'Tomorrow, Oct 29',
    time: time || existingSlot?.time || '3:30 PM',
    modality: modality || existingSlot?.modality || 'Sanctuary Suite 204 or Video',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  insert('appointments', apptRecord);

  // Update associated case
  if (caseId) {
    update('cases', caseId, {
      appointmentId: apptRecord.id,
      status: 'APPOINTMENT_SCHEDULED',
      appointment: apptRecord
    });
  }

  return apptRecord;
}

export function cancelAppointment(appointmentId) {
  const appt = findOne('appointments', appointmentId);
  if (!appt) return null;

  update('appointments', appointmentId, { status: 'cancelled' });
  return appt;
}
