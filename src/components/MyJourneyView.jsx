import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  HeartHandshake,
  Check,
  ChevronRight,
  ShieldCheck,
  Lock,
  MessageSquare,
  UserCheck,
  BookOpen,
  Volume2,
  FileText,
  RotateCcw,
  Send
} from 'lucide-react';
import { 
  getCurrentCase, 
  subscribeStore, 
  reassessCase, 
  getStore, 
  acceptWaitlistOffer, 
  declineWaitlistOffer,
  sendStudentCaseMessage,
  bookAppointment
} from '../services/store';
import { analyzeStudentMessage } from '../services/nlpService';
import { getBridgeResourcesForThemes } from '../services/semanticSearchService';

// SECTION 61: LIVE CASE STATUS STAGES
const CASE_STAGES = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'under_review', label: 'Under review' },
  { id: 'assigned', label: 'Assigned to counsellor' },
  { id: 'accepted', label: 'Counsellor accepted' },
  { id: 'appointment', label: 'Appointment scheduled' },
  { id: 'in_progress', label: 'Support in progress' },
  { id: 'follow_up', label: 'Follow-up' },
  { id: 'closed', label: 'Closed' }
];

function getStageIndex(status = '') {
  const s = status.toLowerCase();
  if (s.includes('closed')) return 7;
  if (s.includes('follow')) return 6;
  if (s.includes('progress') || s.includes('active care')) return 5;
  if (s.includes('appointment')) return 4;
  if (s.includes('accepted') || s.includes('responded')) return 3;
  if (s.includes('assigned')) return 2;
  if (s.includes('review')) return 1;
  return 0; // submitted
}

export default function MyJourneyView({ onNavigate }) {
  const [storeState, setStoreState] = useState(getStore());
  const [activeCase, setActiveCase] = useState(getCurrentCase());
  
  // Reassessment modal state
  const [showReassessModal, setShowReassessModal] = useState(false);
  const [reassessText, setReassessText] = useState('');
  const [reassessingLoading, setReassessingLoading] = useState(false);
  const [reassessResult, setReassessResult] = useState(null);

  // Student messaging state
  const [studentReplyText, setStudentReplyText] = useState('');
  const [replyFeedback, setReplyFeedback] = useState('');

  useEffect(() => {
    return subscribeStore((updated) => {
      setStoreState({ ...updated });
      setActiveCase(getCurrentCase());
    });
  }, []);

  const timelineSteps = activeCase?.timeline || [
    {
      id: 1,
      title: 'Concern Shared in Private',
      timestamp: 'Today, 10:24 AM',
      desc: 'Shared situation through HERE front door. Protected under FERPA.',
      status: 'completed',
      color: '#8DCFA9',
    },
    {
      id: 2,
      title: 'HERE Coordinated Support Graph',
      timestamp: 'Today, 10:25 AM',
      desc: 'Matched across Academic Strategy and Counselling & Wellbeing.',
      status: 'completed',
      color: '#8DCFA9',
    },
    {
      id: 3,
      title: 'Support Pathway Selected & Confirmed',
      timestamp: 'Today, 10:30 AM',
      desc: `Lead specialist assigned: ${activeCase?.assignedCounsellor || 'Dr. Sarah Jenkins'}.`,
      status: 'active',
      color: '#EBA756',
    },
    {
      id: 4,
      title: 'Consultation & Action Plan',
      timestamp: 'Upcoming',
      desc: 'Confidential 1-on-1 session and exam mitigation roadmap.',
      status: 'upcoming',
      color: '#78746C',
    }
  ];

  // Dynamic Bridge Resources based on active case needs
  const bridgeResources = getBridgeResourcesForThemes(activeCase?.themes || []);

  // Check if there is an active waitlist swap offer notification
  const activeSwapOffer = storeState.notifications?.find(n => n.type === 'waitlist_offer' && !n.accepted && !n.declined);

  const currentStageIndex = getStageIndex(activeCase?.status || 'Submitted');

  const handleStartReassessment = async () => {
    if (!reassessText.trim() || !activeCase) return;
    setReassessingLoading(true);

    try {
      const nlp = await analyzeStudentMessage(reassessText);
      setReassessResult(nlp);
      reassessCase(activeCase.id, reassessText, nlp);
      setTimeout(() => {
        setReassessingLoading(false);
        setShowReassessModal(false);
        setReassessText('');
        setReassessResult(null);
      }, 1200);
    } catch (e) {
      console.error(e);
      setReassessingLoading(false);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!studentReplyText.trim() || !activeCase) return;

    sendStudentCaseMessage(activeCase.id, studentReplyText.trim(), activeCase.studentName);
    setStudentReplyText('');
    setReplyFeedback('Your reply has been sent to your counsellor.');
    setTimeout(() => setReplyFeedback(''), 4000);
  };

  const handleAcceptSwap = (notifId) => {
    acceptWaitlistOffer(notifId);
  };

  const handleDeclineSwap = (notifId) => {
    declineWaitlistOffer(notifId);
  };

  return (
    <section 
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0B0B0E',
        overflow: 'hidden',
      }}
    >
      {/* Warm Ambient Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 167, 86, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Active Waitlist Swap Banner if Offer Exists */}
        {activeSwapOffer && (
          <div 
            style={{
              padding: '20px 24px',
              borderRadius: '20px',
              background: 'rgba(235, 167, 86, 0.15)',
              border: '1px solid rgba(235, 167, 86, 0.4)',
              color: '#FAF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '2.5rem',
              animation: 'fadeIn 200ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EBA756', color: '#17120B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '16px' }}>⚡ An Earlier Consultation Slot Just Opened!</strong>
                <div style={{ fontSize: '13.5px', color: '#CBD5E1', marginTop: '2px' }}>
                  {activeSwapOffer.message}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleAcceptSwap(activeSwapOffer.id)}
                className="btn-warm"
                style={{ fontSize: '13px', padding: '9px 20px' }}
              >
                <span>Accept Earlier Slot</span>
              </button>

              <button
                onClick={() => handleDeclineSwap(activeSwapOffer.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#B8B3AA',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '9px 14px'
                }}
              >
                Keep current time
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: '2.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(141, 207, 169, 0.12)',
              color: '#8DCFA9',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '1.25rem',
            }}
          >
            <Clock size={15} />
            <span>Transparent, Non-judgmental Care Tracking</span>
          </div>

          <h2 
            className="font-editorial"
            style={{
              fontSize: 'clamp(32px, 3.8vw, 54px)',
              lineHeight: 1.15,
              color: '#FAF8F5',
              marginBottom: '1.25rem',
            }}
          >
            You are never left <br />
            hanging in a <span style={{ color: '#F4B6D7', fontStyle: 'italic' }}>faceless university inbox.</span>
          </h2>

          <p 
            style={{
              fontSize: 'clamp(15px, 1.15vw, 17px)',
              lineHeight: 1.65,
              color: '#B8B3AA',
            }}
          >
            Every request has a name, a timeline, and a human specialist attached. Here is what your active support sanctuary looks like from start to resolution.
          </p>
        </div>

        {/* ======================================================== */}
        {/* SECTION 61: LIVE CASE STATUS PIPELINE PROGRESSION */}
        {/* ======================================================== */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px 28px',
            borderRadius: '20px',
            background: 'rgba(22, 21, 30, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '2.5rem',
            overflowX: 'auto'
          }}
        >
          <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', fontWeight: 600 }}>
            Live Case Care Progression:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '700px', position: 'relative' }}>
            {CASE_STAGES.map((stg, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  {/* Progress Line between stages */}
                  {idx > 0 && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '50%',
                        left: '-50%',
                        height: '2px',
                        background: isPassed || isCurrent ? '#8DCFA9' : 'rgba(255, 255, 255, 0.08)',
                        zIndex: 1,
                        transition: 'background 300ms ease'
                      }}
                    />
                  )}

                  {/* Stage Dot */}
                  <div 
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCurrent ? '#EBA756' : isPassed ? '#8DCFA9' : '#1E1D26',
                      border: isCurrent ? '2px solid rgba(235, 167, 86, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 2,
                      color: isPassed || isCurrent ? '#0B0B0E' : '#78746C',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {isPassed ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </div>

                  {/* Stage Label */}
                  <span 
                    style={{
                      fontSize: '11.5px',
                      marginTop: '8px',
                      textAlign: 'center',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? '#EBA756' : isPassed ? '#FAF8F5' : '#78746C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {stg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout: Left Active Journey + Right Specialist & Messages */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Interactive Timeline & Student Reassessment */}
          <div 
            className="glass-panel"
            style={{
              padding: '36px 32px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ACTIVE SUPPORT FILE #{activeCase?.id || 'CASE-2026-00142'}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FAF8F5', marginTop: '2px' }}>
                  {activeCase?.themes?.[0]?.label || 'Academic Anxiety & Fee Petition'}
                </h3>
              </div>

              <span 
                style={{
                  background: activeCase?.urgency === 'AMBER' ? 'rgba(235, 167, 86, 0.15)' : 'rgba(141, 207, 169, 0.15)',
                  color: activeCase?.urgency === 'AMBER' ? '#EBA756' : '#8DCFA9',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {activeCase?.status || 'In Active Care'}
              </span>
            </div>

            {/* Timeline Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
              {/* Connecting line */}
              <div 
                style={{
                  position: 'absolute',
                  top: '18px',
                  bottom: '18px',
                  left: '17px',
                  width: '2px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  zIndex: 1,
                }}
              />

              {timelineSteps.map((step) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', zIndex: 2 }}>
                    {/* Step Indicator Dot */}
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isCompleted ? '#8DCFA9' : isActive ? '#EBA756' : '#1E1D26',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isCompleted || isActive ? '#0B0B0E' : '#78746C',
                      }}
                    >
                      {isCompleted ? <Check size={18} strokeWidth={2.5} /> : <span style={{ fontSize: '13px', fontWeight: 700 }}>{step.id}</span>}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: isActive ? '#EBA756' : '#FAF8F5' }}>
                          {step.title}
                        </h4>
                        <span style={{ fontSize: '12px', color: '#78746C' }}>
                          {step.timestamp}
                        </span>
                      </div>
                      <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#B8B3AA' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "Something Changed?" Reassessment Prompt */}
            <div 
              style={{
                marginTop: '2.5rem',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#FAF8F5' }}>
                  Feeling more anxious or situation changed?
                </div>
                <div style={{ fontSize: '12px', color: '#78746C' }}>
                  Re-evaluate your support coordinates at any time with zero penalty.
                </div>
              </div>

              <button
                onClick={() => setShowReassessModal(true)}
                style={{
                  background: 'rgba(244, 182, 215, 0.12)',
                  color: '#F4B6D7',
                  border: 'none',
                  outline: 'none',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={13} />
                <span>Something changed</span>
              </button>
            </div>
          </div>

          {/* Right Column: Specialist Card + SECTION 60 MESSAGES THREAD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Dedicated Specialist Card */}
            <div 
              className="glass-panel"
              style={{
                padding: '30px 28px',
                borderRadius: '24px',
                background: 'rgba(24, 23, 34, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
                <div 
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(244, 182, 215, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F4B6D7',
                    fontSize: '20px',
                    fontWeight: 700
                  }}
                >
                  SJ
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#8DCFA9', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    Assigned Lead Specialist
                  </span>
                  <h4 style={{ fontSize: '19px', fontWeight: 600, color: '#FAF8F5', marginTop: '2px' }}>
                    {activeCase?.assignedCounsellor || 'Dr. Sarah Jenkins'}
                  </h4>
                  <div style={{ fontSize: '12.5px', color: '#B8B3AA' }}>
                    Senior Clinical Wellbeing & Student Advocacy Lead
                  </div>
                </div>
              </div>

              {/* Consultation details */}
              <div style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#78746C' }}>Consultation Status:</span>
                  <strong style={{ color: '#FAF8F5' }}>
                    {activeCase?.appointment ? `${activeCase.appointment.date} · ${activeCase.appointment.time}` : 'No slot reserved yet'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#78746C' }}>Modality:</span>
                  <span style={{ color: '#8DCFA9' }}>{activeCase?.appointment?.modality || 'Confidential 1-on-1 Consultation'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onNavigate('/appointments')}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '9px 16px' }}
                >
                  <span>{activeCase?.appointment ? 'Reschedule Session' : 'Book 1-on-1 Session'}</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 60: REAL SHARED CASE CONVERSATION THREAD */}
            {/* ======================================================== */}
            <div 
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: '24px',
                background: 'rgba(24, 23, 34, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={17} color="#F4B6D7" />
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5' }}>
                    Messages with Your Counsellor
                  </h4>
                </div>
                <span style={{ fontSize: '11px', color: '#8DCFA9', fontWeight: 600 }}>
                  Active Thread
                </span>
              </div>

              {replyFeedback && (
                <div 
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(141, 207, 169, 0.12)',
                    color: '#8DCFA9',
                    fontSize: '12px',
                    marginBottom: '12px'
                  }}
                >
                  ✓ {replyFeedback}
                </div>
              )}

              {/* Message History */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  padding: '12px',
                  background: 'rgba(12, 12, 16, 0.6)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  marginBottom: '14px'
                }}
              >
                {(!activeCase?.messages || activeCase.messages.length === 0) ? (
                  <div style={{ fontSize: '12.5px', color: '#78746C', textAlign: 'center', padding: '16px 0' }}>
                    Your counsellor will review your file shortly and reach out here.
                  </div>
                ) : (
                  activeCase.messages.map((m) => {
                    const isStudent = m.sender === 'student';
                    return (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: isStudent ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          padding: '10px 14px',
                          borderRadius: '14px',
                          background: isStudent ? 'rgba(244, 182, 215, 0.15)' : 'rgba(142, 220, 242, 0.15)',
                          border: isStudent ? '1px solid rgba(244, 182, 215, 0.25)' : '1px solid rgba(142, 220, 242, 0.25)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '2px', fontSize: '11px' }}>
                          <strong style={{ color: isStudent ? '#F4B6D7' : '#8EDCF2' }}>
                            {m.senderName || (isStudent ? 'You' : 'Dr. Sarah Jenkins')}
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

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={studentReplyText}
                  onChange={(e) => setStudentReplyText(e.target.value)}
                  placeholder="Reply to Dr. Sarah Jenkins..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FAF8F5',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!studentReplyText.trim()}
                  className="btn-primary"
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  <Send size={14} />
                  <span>Reply</span>
                </button>
              </form>
            </div>

            {/* "While You Wait..." Bridge Support Section */}
            <div 
              className="glass-panel"
              style={{
                padding: '26px',
                borderRadius: '24px',
                background: 'rgba(24, 23, 34, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={16} color="#EBA756" />
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5' }}>
                  While you wait for your session:
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: '#B8B3AA', lineHeight: 1.5, marginBottom: '14px' }}>
                Instant calming toolkits tailored to your expressed concerns ({activeCase?.themes?.map(t => typeof t === 'string' ? t : t.label).join(', ') || 'Exams and Sleep'}).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bridgeResources.map((res) => (
                  <div 
                    key={res.id}
                    onClick={() => onNavigate('/resources')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 150ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#FAF8F5' }}>{res.title}</div>
                      <div style={{ fontSize: '11px', color: '#78746C' }}>{res.duration} · {res.type}</div>
                    </div>
                    <ArrowRight size={13} color="#EBA756" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Reassessment Modal */}
      {showReassessModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowReassessModal(false)}
        >
          <div 
            style={{
              maxWidth: '560px',
              width: '100%',
              background: '#16151E',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '32px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RefreshCw size={18} color="#EBA756" />
              <h3 style={{ fontSize: '20px', fontWeight: 650, color: '#FAF8F5' }}>
                Reassess My Situation
              </h3>
            </div>
            
            <p style={{ fontSize: '14px', color: '#B8B3AA', lineHeight: 1.6, marginBottom: '18px' }}>
              If your stress has escalated, you received an unexpected grade, or your housing situation shifted, let us know. HERE updates your priority tier without deleting your progress.
            </p>

            <textarea 
              value={reassessText}
              onChange={(e) => setReassessText(e.target.value)}
              placeholder="e.g. My landlord gave me an eviction notice and I haven't slept in 3 days..."
              rows={4}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(12, 12, 16, 0.7)',
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
                onClick={() => setShowReassessModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#B8B3AA', cursor: 'pointer', fontSize: '13.5px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleStartReassessment}
                disabled={!reassessText.trim() || reassessingLoading}
                className="btn-warm"
                style={{ fontSize: '13.5px', padding: '10px 22px' }}
              >
                <span>{reassessingLoading ? "Recalibrating..." : "Update Support Coordinates"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
