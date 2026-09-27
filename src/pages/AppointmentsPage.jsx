import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { getStore, bookAppointment, getCurrentCase } from '../services/store';

export default function AppointmentsPage({ onNavigate }) {
  const store = getStore();
  const currentCase = getCurrentCase();

  const [selectedDept, setSelectedDept] = useState('Counselling & Mental Wellbeing');
  const [selectedDate, setSelectedDate] = useState('Wednesday, Oct 28');
  const [selectedTime, setSelectedTime] = useState('02:30 PM');
  const [selectedCounsellor, setSelectedCounsellor] = useState('Dr. Sarah Jenkins');
  const [isBooked, setIsBooked] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);

  const departments = [
    'Counselling & Mental Wellbeing',
    'Academic Strategy & Tutoring',
    'Emergency Aid & Student Grants',
    'Accessibility & Neurodiversity',
    'Housing & International Services',
  ];

  const specialists = [
    { name: 'Dr. Sarah Jenkins', dept: 'Counselling & Mental Wellbeing', spec: 'Acute Academic Anxiety & Burnout', rating: 'Lead Specialist' },
    { name: 'Prof. Marcus Vance', dept: 'Academic Strategy & Tutoring', spec: 'STEM Exam De-escalation & Petitions', rating: 'Senior Advisor' },
    { name: 'Elena Rostova', dept: 'Emergency Aid & Student Grants', spec: 'Discretionary Hardship & Fee Appeals', rating: 'Financial Officer' },
    { name: 'Dr. Amara Thorne', dept: 'Accessibility & Neurodiversity', spec: 'ADHD Accommodations & Exam Modifications', rating: 'Clinical Lead' }
  ];

  const timeslots = [
    '09:00 AM',
    '10:30 AM',
    '11:45 AM',
    '02:30 PM',
    '03:45 PM',
    '05:00 PM',
  ];

  const days = [
    { label: 'Wed', dateText: 'Wednesday, Oct 28', num: 28 },
    { label: 'Thu', dateText: 'Thursday, Oct 29', num: 29 },
    { label: 'Fri', dateText: 'Friday, Oct 30', num: 30 },
    { label: 'Mon', dateText: 'Monday, Nov 02', num: 2 },
    { label: 'Tue', dateText: 'Tuesday, Nov 03', num: 3 },
  ];

  const handleConfirm = () => {
    const apt = bookAppointment({
      caseId: currentCase?.id || 'CASE-2026-00142',
      counsellorName: selectedCounsellor,
      dept: selectedDept,
      date: selectedDate,
      time: selectedTime,
      modality: 'Confidential 1-on-1 Consultation'
    });

    setBookedDetails(apt);
    setIsBooked(true);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#0B0B0E', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3rem)' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(235, 167, 86, 0.12)',
              fontSize: '12.5px',
              color: '#EBA756',
              marginBottom: '1rem',
            }}
          >
            <CalendarIcon size={14} />
            <span>Direct Coordinated Scheduling</span>
          </div>

          <h1 
            style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 650,
              color: '#FAF8F5',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              lineHeight: 1.15
            }}
          >
            Book a confidential session.
          </h1>
          <p style={{ fontSize: '16px', color: '#B8B3AA' }}>
            Choose your support specialist and reserved confidential time slot. Zero faculty visibility.
          </p>
        </div>

        {!isBooked ? (
          <div 
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Step 1: Department Selection */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAF8F5', marginBottom: '12px' }}>
                1. Select University Support Pathway
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {departments.map((dept) => {
                  const isSelected = selectedDept === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept);
                        const match = specialists.find(s => s.dept === dept);
                        if (match) setSelectedCounsellor(match.name);
                      }}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '9999px',
                        border: 'none',
                        outline: 'none',
                        background: isSelected ? '#FAF8F5' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#0B0B0E' : '#B8B3AA',
                        fontSize: '13.5px',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Specialist */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAF8F5', marginBottom: '12px' }}>
                2. Available Support Specialist
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {specialists.map((sp) => {
                  const isSelected = selectedCounsellor === sp.name;
                  return (
                    <div
                      key={sp.name}
                      onClick={() => {
                        setSelectedCounsellor(sp.name);
                        setSelectedDept(sp.dept);
                      }}
                      style={{
                        padding: '16px 18px',
                        borderRadius: '16px',
                        background: isSelected ? 'rgba(244, 182, 215, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid rgba(244, 182, 215, 0.4)' : '1px solid rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: 600, color: isSelected ? '#F4B6D7' : '#FAF8F5' }}>
                          {sp.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8DCFA9' }}>{sp.rating}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#78746C' }}>{sp.dept}</div>
                      <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '4px' }}>{sp.spec}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Date Selection */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAF8F5', marginBottom: '12px' }}>
                3. Choose Date
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {days.map((item) => {
                  const isSelected = selectedDate === item.dateText;
                  return (
                    <div
                      key={item.num}
                      onClick={() => setSelectedDate(item.dateText)}
                      style={{
                        padding: '16px 12px',
                        borderRadius: '14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isSelected ? '#FAF8F5' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#0B0B0E' : '#FAF8F5',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>{item.label}</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>{item.num}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Time Slot */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAF8F5', marginBottom: '12px' }}>
                4. Select Time Slot
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {timeslots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        outline: 'none',
                        background: isSelected ? 'rgba(235, 167, 86, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#EBA756' : '#FAF8F5',
                        fontSize: '13.5px',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waitlist Swap Feature Note */}
            <div style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(235, 167, 86, 0.08)', border: '1px solid rgba(235, 167, 86, 0.2)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#EBA756" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#EBA756' }}>Dynamic Waitlist Swap Included</span>
              </div>
              <p style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '4px', lineHeight: 1.5 }}>
                When you reserve this slot, you are automatically eligible for earlier cancellations. If another student reschedules, HERE will notify you immediately to move your consultation forward.
              </p>
            </div>

            {/* Confirmation CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#78746C' }}>
                <ShieldCheck size={16} color="#8DCFA9" />
                <span>100% Confidential · Covered under university health privacy</span>
              </div>

              <button
                onClick={handleConfirm}
                className="btn-primary"
                style={{ fontSize: '14.5px', padding: '12px 28px' }}
              >
                <span>Confirm & Reserve Slot</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Booked Confirmation Card */
          <div 
            className="glass-panel"
            style={{
              padding: '48px 36px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.85)',
              textAlign: 'center',
              border: '1px solid rgba(141, 207, 169, 0.35)',
              animation: 'fadeIn 300ms ease'
            }}
          >
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(141, 207, 169, 0.15)',
                color: '#8DCFA9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <Check size={32} strokeWidth={2.5} />
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 650, color: '#FAF8F5', marginBottom: '8px' }}>
              Your Session Is Confirmed
            </h2>
            <p style={{ fontSize: '15px', color: '#B8B3AA', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              A confidential consultation has been reserved with <strong style={{ color: '#FAF8F5' }}>{selectedCounsellor}</strong> for <strong style={{ color: '#FAF8F5' }}>{selectedDate} at {selectedTime}</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('/journey')}
                className="btn-primary"
                style={{ fontSize: '14px', padding: '12px 24px' }}
              >
                <span>Track in My Journey →</span>
              </button>

              <button
                onClick={() => onNavigate('/resources')}
                className="btn-secondary"
                style={{ fontSize: '14px', padding: '12px 22px' }}
              >
                <span>Explore Calming Bridge Resources</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
