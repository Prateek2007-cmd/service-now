import React, { useState, useEffect } from 'react';import {
 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Send, 
  RefreshCw, 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  ArrowRight,
  UserCheck,
  ChevronRight,
  PhoneCall,
  Lock,
  MessageSquare,
  BookOpen,
  AlertOctagon,
  Check,
  Share2
} from 'lucide-react';import {
 
  getStore, 
  subscribeStore, 
  cancelAppointmentAndTriggerWaitlistSwap,
  acceptCaseByCounsellor,
  sendCounsellorMessage,
  bookAppointment,
  markSessionComplete
} from '../services/store';
import DemoClockPanel from '../components/DemoClockPanel';
import { anonymizeCase } from '../services/anonymizeService';
import CareSummaryView from '../components/CareSummaryView';
import { isSessionStillUpcoming } from '../services/store';

export default function CounsellorPortalPage({ onNavigate }) {
  const [storeState, setStoreState] = useState(getStore());
  const cases = storeState.cases || [];
  const waitlist = storeState.waitlist || [];

  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'appointments' | 'queue'
  const [caseFilter, setCaseFilter] = useState('all'); // 'all' | 'new' | 'urgent' | 'active'
  const [selectedCase, setSelectedCase] = useState(cases[0] || null);
  const [counsellorNote, setCounsellorNote] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);
  const [swapSimulated, setSwapSimulated] = useState(false);
  
  // Interactive Modals for Primary Actions
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactText, setContactText] = useState("Thanks for reaching out. I've reviewed your request. Let's find a suitable time to talk.");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('Tomorrow');
  const [scheduleTime, setScheduleTime] = useState('2:00 PM');
  const [scheduleModality, setScheduleModality] = useState('Confidential Video Consultation');
  const [actionNotice, setActionNotice] = useState('');

  // Keep state synced with store changes
  useEffect(() => {
    return subscribeStore((updated) => {
      setStoreState({ ...updated });
      if (selectedCase) {
        const found = updated.cases?.find(c => c.id === selectedCase.id);
        if (found) setSelectedCase(found);
      } else if (updated.cases?.length > 0) {
        setSelectedCase(updated.cases[0]);
      }
    });
  }, [selectedCase]);

  // If initial case wasn't set, select first case
  useEffect(() => {
    if (!selectedCase && cases.length > 0) {
      setSelectedCase(cases[0]);
    }
  }, [cases, selectedCase]);

  // Calculate stats
  const newCasesCount = cases.filter(c => c.status === 'Assigned to counsellor' || c.status === 'Submitted' || c.status === 'Under review').length;
  const activeCasesCount = cases.filter(c => c.status === 'Accepted by counsellor' || c.status === 'In Active Care' || c.status === 'Counsellor Responded').length;
  const urgentCasesCount = cases.filter(c => c.urgency === 'AMBER' || c.urgency === 'RED').length;
  const todayAppointmentsCount = cases.filter(c => c.appointment && c.appointment.status !== 'cancelled').length;

  // A live booking is one that is confirmed and not yet finished or cancelled.
  // Only then is a further scheduling offer suppressed.
  const hasLiveAppointment = Boolean(
    selectedCase?.appointment &&
    selectedCase.appointment.status !== 'cancelled' &&
    selectedCase.appointment.status !== 'completed'
  );

  // Filter cases based on selected filter
  const filteredCases = cases.filter(c => {
    if (caseFilter === 'new') return c.status === 'Assigned to counsellor' || c.status === 'Submitted' || c.status === 'Under review';
    if (caseFilter === 'urgent') return c.urgency === 'AMBER' || c.urgency === 'RED';
    if (caseFilter === 'active') return c.status === 'Accepted by counsellor' || c.status === 'In Active Care' || c.status === 'Counsellor Responded';
    return true;
  });

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setCounsellorNote('');
    setNoteSuccess(false);
  };

  // 1. PRIMARY ACTION: ACCEPT CASE
  const handleAcceptCase = (caseId) => {
    const updated = acceptCaseByCounsellor(caseId, 'Dr. Sarah Jenkins');
    if (updated) {
      setSelectedCase({ ...updated });
      setActionNotice('Case accepted. Status updated to "Accepted by counsellor" and student notified.');
      setTimeout(() => setActionNotice(''), 4500);
    }
  };

  // 2. PRIMARY ACTION: CONTACT STUDENT
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!contactText.trim() || !selectedCase) return;
    
    sendCounsellorMessage(selectedCase.id, contactText.trim(), 'Dr. Sarah Jenkins');
    setContactText('');
    setActionNotice('Secure message dispatched. Student notified in My Journey.');
    setTimeout(() => setActionNotice(''), 4500);
  };

  // 3. PRIMARY ACTION: SCHEDULE APPOINTMENT
  const handleScheduleAppointment = () => {
    if (!selectedCase) return;
    // Guard the action, not just the button. The earlier audit found re-booking
    // was unguarded and silently replaced the existing appointment.
    if (hasLiveAppointment) {
      setActionNotice('This student already has a scheduled consultation. Cancel or complete it first.');
      setTimeout(() => setActionNotice(''), 5000);
      return;
    }
    const result = bookAppointment({
      caseId: selectedCase.id,
      counsellorName: 'Dr. Sarah Jenkins',
      dept: 'Counselling & Mental Wellbeing',
      date: scheduleDate,
      time: scheduleTime,
      modality: scheduleModality
    });
    setShowScheduleModal(false);
    setActionNotice(
      result?.success
        ? `Consultation reserved for ${scheduleDate} at ${scheduleTime}. Synced with student timeline.`
        : (result?.error || 'Could not reserve that slot.')
    );
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleAddNote = () => {
    if (!counsellorNote.trim() || !selectedCase) return;
    
    selectedCase.timeline.push({
      id: selectedCase.timeline.length + 1,
      title: 'Advisor Clinical Note',
      timestamp: 'Just now',
      desc: counsellorNote.trim(),
      status: 'completed',
      color: '#8DCFA9'
    });

    setNoteSuccess(true);
    setCounsellorNote('');
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  const [sessionCompleted, setSessionCompleted] = useState(false);

  const handleTriggerCancelAndSwap = (aptId) => {
    cancelAppointmentAndTriggerWaitlistSwap(aptId);
    setSwapSimulated(true);
    setTimeout(() => setSwapSimulated(false), 5000);
  };

  /**
   * The counsellor closing the session. This is the real trigger for the
   * student's feedback prompt, so it is an explicit clinical action rather than
   * something inferred from a calendar string.
   */
  const handleMarkComplete = (attended) => {
    if (!selectedCase?.appointment) return;
    const result = markSessionComplete({
      caseId: selectedCase.id,
      appointmentId: selectedCase.appointment.id,
      attended,
      sessionNote,
    });
    if (result.ok) {
      setSessionCompleted(true);
      setCounsellorNote('');
      setTimeout(() => setSessionCompleted(false), 5000);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#0B0B0E', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3.5rem)' }}>
        
        {/* Banner: Counsellor Portal Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: 'rgba(244, 182, 215, 0.12)',
                color: '#F4B6D7',
                fontSize: '12.5px',
                fontWeight: 500,
                marginBottom: '0.75rem',
              }}
            >
              <ShieldCheck size={14} />
              <span>Certified Support Staff Portal · FERPA Guarded</span>
            </div>
            <h1 
              style={{
                fontSize: 'clamp(28px, 3.2vw, 42px)',
                fontWeight: 650,
                color: '#FAF8F5',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              Counsellor Sanctuary Cockpit
            </h1>
            <p style={{ fontSize: '15px', color: '#B8B3AA', marginTop: '4px' }}>
              Logged in as <strong style={{ color: '#FAF8F5' }}>Dr. Sarah Jenkins</strong> · Senior Clinical Wellbeing Lead
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', borderRadius: '16px', minWidth: '125px' }}>
              <div style={{ fontSize: '11px', color: '#8EDCF2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Cases</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#8EDCF2', marginTop: '2px' }}>{newCasesCount}</div>
            </div>
            <div style={{ background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', borderRadius: '16px', minWidth: '125px' }}>
              <div style={{ fontSize: '11px', color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urgent Amber</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#EBA756', marginTop: '2px' }}>{urgentCasesCount}</div>
            </div>
            <div style={{ background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', borderRadius: '16px', minWidth: '125px' }}>
              <div style={{ fontSize: '11px', color: '#F4B6D7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Care</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#FAF8F5', marginTop: '2px' }}>{activeCasesCount}</div>
            </div>
            <div style={{ background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', borderRadius: '16px', minWidth: '125px' }}>
              <div style={{ fontSize: '11px', color: '#8DCFA9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appointments</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#8DCFA9', marginTop: '2px' }}>{todayAppointmentsCount}</div>
            </div>
            <div style={{ background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', borderRadius: '16px', minWidth: '125px' }}>
              <div style={{ fontSize: '11px', color: '#B8B3AA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wait Queue</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#B8B3AA', marginTop: '2px' }}>{waitlist.length}</div>
            </div>
          </div>
        </div>

        {/* Action Feedback Notice */}
        {actionNotice && (
          <div 
            style={{
              padding: '14px 20px',
              borderRadius: '16px',
              background: 'rgba(141, 207, 169, 0.15)',
              border: '1px solid rgba(141, 207, 169, 0.4)',
              color: '#8DCFA9',
              fontSize: '13.5px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1.5rem',
              animation: 'fadeIn 200ms ease'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Waitlist Swap Alert Banner if Triggered */}
        {swapSimulated && (
          <div 
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(141, 207, 169, 0.15)',
              border: '1px solid rgba(141, 207, 169, 0.4)',
              color: '#FAF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              animation: 'fadeIn 200ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={20} color="#8DCFA9" />
              <div>
                <strong>Waitlist Swap Engine Activated!</strong>
                <div style={{ fontSize: '13px', color: '#B8B3AA' }}>
                  Cancelled slot was detected. Operational matcher dispatched immediate offer to next student in waitlist queue.
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('/journey')}
              className="btn-primary"
              style={{ fontSize: '12.5px', padding: '8px 16px' }}
            >
              <span>View Student Journey</span>
            </button>
          </div>
        )}

        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.75rem', paddingBottom: '12px' }}>
          {[
            { id: 'cases', label: 'Student Case Files', count: cases.length },
            { id: 'appointments', label: "Consultation Schedule", count: todayAppointmentsCount },
            { id: 'queue', label: 'Department Waitlist Queue', count: waitlist.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? '#FAF8F5' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? '#0B0B0E' : '#B8B3AA',
                transition: 'all 200ms ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: '11px', opacity: 0.7, background: activeTab === tab.id ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '10px' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: Assigned Cases List & Case Detail View */}
        {activeTab === 'cases' && (
          <div>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '6px' }}>Filter:</span>
              {[
                { id: 'all', label: `All (${cases.length})` },
                { id: 'new', label: `New (${newCasesCount})` },
                { id: 'urgent', label: `Urgent (${urgentCasesCount})` },
                { id: 'active', label: `Active (${activeCasesCount})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCaseFilter(f.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: caseFilter === f.id ? 600 : 400,
                    background: caseFilter === f.id ? 'rgba(244, 182, 215, 0.15)' : 'rgba(255,255,255,0.04)',
                    color: caseFilter === f.id ? '#F4B6D7' : '#B8B3AA',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 400px) 1fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* Case List Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '800px', overflowY: 'auto' }}>
                {filteredCases.map((c) => {
                  const isSelected = selectedCase?.id === c.id;
                  const isNew = c.status === 'Assigned to counsellor' || c.status === 'Submitted';

                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCase(c)}
                      className="glass-panel"
                      style={{
                        padding: '18px 20px',
                        borderRadius: '18px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(38, 36, 52, 0.9)' : 'rgba(22, 21, 30, 0.75)',
                        border: isSelected ? '1px solid rgba(244, 182, 215, 0.4)' : isNew ? '1px solid rgba(142, 220, 242, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 200ms ease',
                        position: 'relative'
                      }}
                    >
                      {isNew && (
                        <span 
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: '#8EDCF2',
                            color: '#091520',
                            textTransform: 'uppercase'
                          }}
                        >
                          New Case
                        </span>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#78746C', fontWeight: 600 }}>{c.id}</span>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', marginTop: '2px' }}>
                            {anonymizeCase(c).alias}
                          </h3>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span 
                          style={{
                            fontSize: '10.5px',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            background: c.urgency === 'RED' ? 'rgba(248, 113, 113, 0.15)' : c.urgency === 'AMBER' ? 'rgba(235, 167, 86, 0.15)' : 'rgba(141, 207, 169, 0.15)',
                            color: c.urgency === 'RED' ? '#F87171' : c.urgency === 'AMBER' ? '#EBA756' : '#8DCFA9',
                          }}
                        >
                          {c.urgency}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#B8B3AA' }}>
                          ● {c.status}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.45, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.approvedSummary || c.message}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {(c.themes || []).map((t, idx) => (
                          <span 
                            key={idx}
                            style={{
                              fontSize: '11px',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              color: '#94A3B8'
                            }}
                          >
                            {typeof t === 'string' ? t : t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Case Detail View Column */}
              <div 
                className="glass-panel"
                style={{
                  padding: '32px 34px',
                  borderRadius: '24px',
                  background: 'rgba(24, 23, 34, 0.8)',
                  minHeight: '600px',
                  border: '1px solid rgba(255, 255, 255, 0.07)'
                }}
              >
                {selectedCase ? (
                  <div>
                    {/* Case Top Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: '#78746C', fontWeight: 600 }}>{selectedCase.id}</span>
                          <span style={{ fontSize: '12px', color: '#8DCFA9' }}>● {selectedCase.status}</span>
                        </div>
                        <h2 style={{ fontSize: '26px', fontWeight: 650, color: '#FAF8F5', marginTop: '4px' }}>
                          {anonymizeCase(selectedCase).alias}
                        </h2>
                        <div style={{ fontSize: '13px', color: '#B8B3AA', marginTop: '2px' }}>
                          Student ID: {anonymizeCase(selectedCase).maskedId} · Intake via HERE Unified Front Door
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span 
                          style={{
                            fontSize: '12px',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            background: selectedCase.urgency === 'RED' ? 'rgba(248, 113, 113, 0.15)' : selectedCase.urgency === 'AMBER' ? 'rgba(235, 167, 86, 0.15)' : 'rgba(141, 207, 169, 0.15)',
                            color: selectedCase.urgency === 'RED' ? '#F87171' : selectedCase.urgency === 'AMBER' ? '#EBA756' : '#8DCFA9',
                          }}
                        >
                          {selectedCase.urgency} Urgency Tier
                        </span>
                        <div style={{ fontSize: '11.5px', color: '#78746C', marginTop: '6px' }}>
                          Routing Confidence: {Math.round((selectedCase.confidence || 0.94) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* SECTION 59: THREE PRIMARY ACTIONS (IMMEDIATELY VISIBLE) */}
                    {/* ======================================================== */}
                    <div 
                      style={{ 
                        padding: '16px', 
                        borderRadius: '16px', 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        marginBottom: '1.75rem' 
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#B8B3AA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', fontWeight: 600 }}>
                        Primary Case Actions:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {/* 1. ACCEPT CASE */}
                        <button
                          onClick={() => handleAcceptCase(selectedCase.id)}
                          disabled={selectedCase.status === 'Accepted by counsellor' || selectedCase.status === 'In Active Care'}
                          className="btn-primary"
                          style={{
                            fontSize: '13px',
                            padding: '10px 18px',
                            opacity: (selectedCase.status === 'Accepted by counsellor' || selectedCase.status === 'In Active Care') ? 0.6 : 1
                          }}
                        >
                          <CheckCircle2 size={16} />
                          <span>{selectedCase.status === 'Accepted by counsellor' ? 'Case Accepted ✓' : '1. ACCEPT CASE'}</span>
                        </button>

                        {/* 2. CONTACT STUDENT */}
                        <button
                          onClick={() => setShowContactModal(true)}
                          className="btn-secondary"
                          style={{ fontSize: '13px', padding: '10px 18px' }}
                        >
                          <MessageSquare size={16} color="#F4B6D7" />
                          <span>2. CONTACT STUDENT</span>
                        </button>

                        {/* 3. SCHEDULE APPOINTMENT
                            A student who already has a live booking must not be
                            offered a second one here: the earlier audit found
                            that an unguarded re-book silently overwrote the
                            first appointment. */}
                        {hasLiveAppointment ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '13px',
                              padding: '10px 18px',
                              borderRadius: '10px',
                              background: 'rgba(141,207,169,0.10)',
                              border: '1px solid rgba(141,207,169,0.28)',
                              color: '#8DCFA9'
                            }}
                          >
                            <Calendar size={16} />
                            <span>
                              3. APPOINTMENT SCHEDULED — {selectedCase.appointment.date} at {selectedCase.appointment.time}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowScheduleModal(true)}
                            className="btn-warm"
                            style={{ fontSize: '13px', padding: '10px 18px' }}
                          >
                            <Calendar size={16} />
                            <span>3. SCHEDULE APPOINTMENT</span>
                          </button>
                        )}
                      </div>

                      {/* Additional Secondary Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setCounsellorNote("Recommended 7-day academic accommodation extension and sleep wellness workshop.");
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#B8B3AA', fontSize: '11.5px', cursor: 'pointer', padding: '4px 8px' }}
                        >
                          + Quick clinical note
                        </button>
                        <span style={{ color: '#78746C' }}>·</span>
                        <button
                          onClick={() => {
                            setActionNotice("3 Bridge resources recommended and shared with student.");
                            setTimeout(() => setActionNotice(''), 4000);
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#B8B3AA', fontSize: '11.5px', cursor: 'pointer', padding: '4px 8px' }}
                        >
                          Recommend resource
                        </button>
                        <span style={{ color: '#78746C' }}>·</span>
                        <button
                          onClick={() => {
                            setActionNotice("Case escalated to Senior Director review queue.");
                            setTimeout(() => setActionNotice(''), 4000);
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#EBA756', fontSize: '11.5px', cursor: 'pointer', padding: '4px 8px' }}
                        >
                          Escalate appropriately
                        </button>
                      </div>
                    </div>

                    {/* Student Consent & Approved Summary */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Lock size={14} color="#8DCFA9" />
                        <span style={{ fontSize: '12px', color: '#8DCFA9', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                          Student-Approved Care Summary (FERPA Protected)
                        </span>
                      </div>
                      <div 
                        style={{
                          padding: '16px 20px',
                          borderRadius: '16px',
                          background: 'rgba(14, 14, 19, 0.75)',
                          borderLeft: '3px solid #F4B6D7',
                          fontSize: '14px',
                          lineHeight: 1.6,
                          color: '#FAF8F5'
                        }}
                      >
                        {selectedCase.approvedSummary || selectedCase.message}
                      </div>
                    </div>

                    {/* Structured, evidence-linked summary. Replaces the flat
                        approvedSummary string, which was either a template or
                        the student's raw first message. */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <CareSummaryView
                        caseObj={selectedCase}
                        studentName={anonymizeCase(selectedCase).alias}
                      />
                    </div>

                    {/* Coordinated University Support Graph */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Coordinated Multi-Department Routing:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(selectedCase.recommendedDepartments || []).map((dept, idx) => (
                          <div 
                            key={idx}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '12px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '13px',
                              color: '#FAF8F5'
                            }}
                          >
                            <CheckCircle2 size={14} color="#8DCFA9" />
                            <span>{dept}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Case Message History (Real-time Bidirectional Thread) */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                          Secure Case Communication Thread ({selectedCase.messages?.length || 0})
                        </div>
                        <button
                          onClick={() => setShowContactModal(true)}
                          style={{ background: 'none', border: 'none', color: '#F4B6D7', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}
                        >
                          + Send reply
                        </button>
                      </div>

                      <div 
                        style={{
                          background: 'rgba(12, 12, 16, 0.6)',
                          borderRadius: '16px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          maxHeight: '240px',
                          overflowY: 'auto',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        {(!selectedCase.messages || selectedCase.messages.length === 0) ? (
                          <div style={{ fontSize: '13px', color: '#78746C', textAlign: 'center', padding: '12px 0' }}>
                            No messages exchanged yet. Click "CONTACT STUDENT" above to send a consultation note.
                          </div>
                        ) : (
                          selectedCase.messages.map((m) => {
                            const isCounsellor = m.sender === 'counsellor';
                            return (
                              <div
                                key={m.id}
                                style={{
                                  alignSelf: isCounsellor ? 'flex-end' : 'flex-start',
                                  maxWidth: '82%',
                                  padding: '10px 14px',
                                  borderRadius: '14px',
                                  background: isCounsellor ? 'rgba(244, 182, 215, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                  border: isCounsellor ? '1px solid rgba(244, 182, 215, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '3px', fontSize: '11px' }}>
                                  <strong style={{ color: isCounsellor ? '#F4B6D7' : '#8EDCF2' }}>
                                    {m.senderName || (isCounsellor ? 'Dr. Sarah Jenkins' : anonymizeCase(selectedCase).alias)}
                                  </strong>
                                  <span style={{ color: '#78746C' }}>{m.time}</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#FAF8F5', lineHeight: 1.45 }}>
                                  {m.text}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Active Appointment or Schedule Slot */}
                    {selectedCase.appointment && (
                      <div 
                        style={{
                          padding: '18px 20px',
                          borderRadius: '16px',
                          background: 'rgba(235, 167, 86, 0.08)',
                          border: '1px solid rgba(235, 167, 86, 0.25)',
                          marginBottom: '1.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '11px', color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            Scheduled Consultation
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#FAF8F5', marginTop: '2px' }}>
                            {selectedCase.appointment.date} · {selectedCase.appointment.time}
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#B8B3AA' }}>
                            Advisor: {selectedCase.appointment.counsellor} ({selectedCase.appointment.modality})
                          </div>
                          {selectedCase.appointment.status === 'completed' && (
                            <div style={{ fontSize: '12px', color: selectedCase.appointment.attended === false ? '#FCA5A5' : '#8DCFA9', marginTop: '4px', fontWeight: 600 }}>
                              {selectedCase.appointment.attended === false ? 'Recorded as missed' : 'Session delivered'}
                              {selectedCase.appointment.sessionOutcome ? ' · student reviewed' : ' · awaiting student review'}
                            </div>
                          )}
                        </div>

                        {/* Mark the session delivered — this is what triggers the
                            student's feedback prompt. Hidden once closed. */}
                        {selectedCase.appointment.status !== 'completed' && selectedCase.appointment.status !== 'cancelled' && isSessionStillUpcoming(selectedCase) && (
                          <div style={{ width: '100%', fontSize: '12px', color: '#EBA756' }}>
                            This session has not happened yet. Use the demo clock below to skip ahead, or come back after the date.
                          </div>
                        )}

                        {selectedCase.appointment.status !== 'completed' && selectedCase.appointment.status !== 'cancelled' && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleMarkComplete(true)}
                              style={{
                                background: 'rgba(141, 207, 169, 0.15)',
                                color: '#8DCFA9',
                                border: '1px solid rgba(141, 207, 169, 0.3)',
                                outline: 'none',
                                padding: '8px 14px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                              title="Confirms the session happened and asks the student for feedback"
                            >
                              ✓ Mark session delivered
                            </button>
                            <button
                              onClick={() => handleMarkComplete(false)}
                              style={{
                                background: 'rgba(248, 113, 113, 0.12)',
                                color: '#FCA5A5',
                                border: '1px solid rgba(248, 113, 113, 0.28)',
                                outline: 'none',
                                padding: '8px 14px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: 500,
                              }}
                              title="Records a no-show — the student is offered a rebooking instead of a review"
                            >
                              Record no-show
                            </button>
                          </div>
                        )}

                        {sessionCompleted && (
                          <div style={{ fontSize: '12px', color: '#8DCFA9', fontWeight: 600, width: '100%' }}>
                            Saved. The student has been asked how it went.
                          </div>
                        )}

                        {selectedCase.appointment.status !== 'completed' && (
                          <div style={{ width: '100%', marginTop: '10px' }}>
                            <DemoClockPanel onNavigate={onNavigate} caseObj={selectedCase} />
                          </div>
                        )}

                        {/* Waitlist Swap Trigger Button */}
                        <button
                          onClick={() => handleTriggerCancelAndSwap(selectedCase.appointment.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#FCA5A5',
                            border: 'none',
                            outline: 'none',
                            padding: '8px 14px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 500
                          }}
                          title="Simulate cancellation to trigger the automated Waitlist Swap offer to waiting students"
                        >
                          Simulate Cancellation (Test Swap)
                        </button>
                      </div>
                    )}

                    {/* Clinical Note Intake */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                        Add Internal Clinical Note (Case Timeline):
                      </div>
                      <textarea 
                        value={counsellorNote}
                        onChange={(e) => setCounsellorNote(e.target.value)}
                        placeholder="e.g. Recommended academic 14-day petition waiver; coordinated bursary grant application with Elena..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(12, 12, 16, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          color: '#FAF8F5',
                          fontSize: '13.5px',
                          lineHeight: 1.5,
                          outline: 'none',
                          resize: 'none',
                          marginBottom: '10px'
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {noteSuccess ? (
                          <span style={{ fontSize: '12.5px', color: '#8DCFA9' }}>✓ Note securely saved to case timeline</span>
                        ) : <span />}
                        <button
                          onClick={handleAddNote}
                          disabled={!counsellorNote.trim()}
                          className="btn-warm"
                          style={{ fontSize: '13px', padding: '8px 18px', opacity: counsellorNote.trim() ? 1 : 0.5 }}
                        >
                          <span>Attach Note to Case</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#78746C' }}>
                    <FileText size={36} strokeWidth={1.5} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <div>Select a student case file from the left to view coordinates and approved summary.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Schedule & Slots (Waitlist Swap Demonstration) */}
        {activeTab === 'appointments' && (
          <div 
            className="glass-panel"
            style={{
              padding: '32px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ maxWidth: '800px', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 650, color: '#FAF8F5' }}>
                Consultation Schedule & Active Consultations
              </h3>
              <p style={{ fontSize: '14px', color: '#B8B3AA', marginTop: '4px' }}>
                Slots booked by students through HERE or assigned by advisors.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cases.filter(c => c.appointment).map(c => (
                <div
                  key={c.id}
                  style={{
                    padding: '20px 24px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Case #{c.id} · {anonymizeCase(c).alias}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', marginTop: '4px' }}>
                      {c.appointment.date} · {c.appointment.time}
                    </div>
                    <div style={{ fontSize: '13px', color: '#B8B3AA' }}>
                      {c.appointment.modality} · Assigned to {c.appointment.counsellor}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setActiveTab('cases');
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '12.5px', padding: '8px 16px' }}
                    >
                      View Student File
                    </button>
                    {c.appointment.status !== 'cancelled' && (
                      <button
                        onClick={() => handleTriggerCancelAndSwap(c.appointment.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#FCA5A5',
                          border: 'none',
                          outline: 'none',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel Slot (Trigger Swap)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Waitlist Queue */}
        {activeTab === 'queue' && (
          <div 
            className="glass-panel"
            style={{
              padding: '32px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ maxWidth: '800px', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 650, color: '#FAF8F5' }}>
                Department Waitlist & Smart Swap Queue
              </h3>
              <p style={{ fontSize: '14px', color: '#B8B3AA', marginTop: '4px' }}>
                Automated matching pool where students receive cancellation offers without administrative friction.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {waitlist.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(141, 207, 169, 0.15)', color: '#8DCFA9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                      #{index + 1}
                    </div>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#FAF8F5' }}>{anonymizeCase(item).alias}</strong>
                      <div style={{ fontSize: '12.5px', color: '#B8B3AA' }}>
                        Case: {item.caseId} · Department: {item.department}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span 
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontWeight: 600,
                        background: item.urgency === 'AMBER' ? 'rgba(235, 167, 86, 0.15)' : 'rgba(141, 207, 169, 0.15)',
                        color: item.urgency === 'AMBER' ? '#EBA756' : '#8DCFA9',
                      }}
                    >
                      {item.urgency}
                    </span>
                    <span style={{ fontSize: '12px', color: '#78746C' }}>
                      Preferred: {item.preferredTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CONTACT STUDENT (SECURE COMMUNICATION) */}
      {/* ======================================================== */}
      {showContactModal && selectedCase && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowContactModal(false)}
        >
          <div 
            style={{
              maxWidth: '580px',
              width: '100%',
              background: '#16151E',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} color="#F4B6D7" />
                <h3 style={{ fontSize: '20px', fontWeight: 650, color: '#FAF8F5' }}>
                  Contact Student: {anonymizeCase(selectedCase).alias}
                </h3>
              </div>
              <button 
                onClick={() => setShowContactModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#78746C', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <p style={{ fontSize: '13.5px', color: '#B8B3AA', lineHeight: 1.5, marginBottom: '16px' }}>
              Dispatch a direct message into the student's confidential HERE Journey. The student will see this instantly upon login.
            </p>

            {/* Quick Demo Pre-fill */}
            <div style={{ marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setContactText("Thanks for reaching out. I've reviewed your request. Let's find a suitable time to talk.")}
                style={{
                  background: 'rgba(244, 182, 215, 0.1)',
                  color: '#F4B6D7',
                  border: 'none',
                  outline: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                ⚡ Use Section 60 Demo Response: "Thanks for reaching out..."
              </button>
            </div>

            <textarea 
              value={contactText}
              onChange={(e) => setContactText(e.target.value)}
              placeholder="Write your message here..."
              rows={4}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(12, 12, 16, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#FAF8F5',
                fontSize: '14px',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'none',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowContactModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#B8B3AA', cursor: 'pointer', fontSize: '13.5px' }}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  handleSendMessage(e);
                  setShowContactModal(false);
                }}
                disabled={!contactText.trim()}
                className="btn-primary"
                style={{ fontSize: '13.5px', padding: '10px 22px' }}
              >
                <Send size={15} />
                <span>Send Message to Student</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SCHEDULE APPOINTMENT (PRIMARY ACTION 3) */}
      {/* ======================================================== */}
      {showScheduleModal && selectedCase && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowScheduleModal(false)}
        >
          <div 
            style={{
              maxWidth: '540px',
              width: '100%',
              background: '#16151E',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={20} color="#EBA756" />
                <h3 style={{ fontSize: '20px', fontWeight: 650, color: '#FAF8F5' }}>
                  Schedule Consultation for {anonymizeCase(selectedCase).alias}
                </h3>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#78746C', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <p style={{ fontSize: '13.5px', color: '#B8B3AA', lineHeight: 1.5, marginBottom: '20px' }}>
              Select an available consultation slot. This will immediately reserve the advisor and notify the student.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#CBD5E1', marginBottom: '6px' }}>
                Available Date:
              </label>
              <select
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(12, 12, 16, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#FAF8F5',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Tomorrow">Tomorrow (Priority triage slot)</option>
                <option value="Thursday, Oct 29">Thursday, Oct 29</option>
                <option value="Friday, Oct 30">Friday, Oct 30</option>
                <option value="Monday, Nov 2">Monday, Nov 2</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#CBD5E1', marginBottom: '6px' }}>
                Time Slot:
              </label>
              <select
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(12, 12, 16, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#FAF8F5',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="11:00 AM">11:00 AM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:30 PM">3:30 PM</option>
                <option value="4:45 PM">4:45 PM</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#CBD5E1', marginBottom: '6px' }}>
                Modality:
              </label>
              <select
                value={scheduleModality}
                onChange={(e) => setScheduleModality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(12, 12, 16, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#FAF8F5',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Confidential Video Consultation">Confidential Video Consultation (Encrypted)</option>
                <option value="Sanctuary Suite 204 (In-Person)">Sanctuary Suite 204 (In-Person)</option>
                <option value="Confidential Phone Call">Confidential Phone Call</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#B8B3AA', cursor: 'pointer', fontSize: '13.5px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleAppointment}
                className="btn-warm"
                style={{ fontSize: '13.5px', padding: '10px 22px' }}
              >
                <span>Confirm & Reserve Slot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
