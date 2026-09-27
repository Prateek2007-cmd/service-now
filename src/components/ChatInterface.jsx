import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  BookOpen, 
  Heart, 
  Coins, 
  Users, 
  Home, 
  Calendar, 
  Compass, 
  Lock, 
  Send, 
  Mic, 
  Sparkles, 
  ArrowRight,
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw, 
  PhoneCall,
  Edit3,
  X,
  UserCheck,
  Info,
  Clock,
  Check,
  HelpCircle,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { AssistantOrb } from './AssistantOrb';
import { 
  getConversationState, 
  postChatMessage, 
  confirmStudentMirror, 
  selectSupportPathway, 
  filterAppointmentOptions, 
  bookConversationalAppointment, 
  resetConversation,
  STAGES
} from '../services/conversationEngine';

export default function ChatInterface({ initialPrompt = '', initialDept = null, onNavigate }) {
  const [convState, setConvState] = useState(getConversationState());
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [activeSidebarItem, setActiveSidebarItem] = useState(initialDept || 'all');
  const [isTyping, setIsTyping] = useState(false);
  const [orbState, setOrbState] = useState('idle');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [progressPhrase, setProgressPhrase] = useState('');
  
  // Inline Editing for AI Mirror (Section 14)
  const [isEditingMirror, setIsEditingMirror] = useState(false);
  const [editableSummary, setEditableSummary] = useState('');

  // Conversational Scheduling Filter (Section 19)
  const [scheduleFilter, setScheduleFilter] = useState('tomorrow_afternoon'); // 'today' | 'tomorrow_afternoon' | 'all'

  // Emotional Companion & Co-Regulation State
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' | 'hold' | 'exhale' | 'complete'
  const [userHoveredOrb, setUserHoveredOrb] = useState(false);

  // Guided breathing loop (4s inhale -> 2.5s hold -> 4s exhale)
  useEffect(() => {
    let timer;
    if (breathActive) {
      if (breathPhase === 'inhale') {
        timer = setTimeout(() => setBreathPhase('hold'), 4000);
      } else if (breathPhase === 'hold') {
        timer = setTimeout(() => setBreathPhase('exhale'), 2500);
      } else if (breathPhase === 'exhale') {
        timer = setTimeout(() => {
          setBreathPhase('complete');
          setTimeout(() => setBreathActive(false), 2500);
        }, 4000);
      }
    }
    return () => clearTimeout(timer);
  }, [breathActive, breathPhase]);

  const handleStartBreathing = () => {
    setBreathPhase('inhale');
    setBreathActive(true);
  };

  // Dynamically derive emotional presence and vibe based on student conversation
  const getEmotionalPresence = () => {
    if (breathActive) {
      return {
        mode: 'BREATHING',
        orbState: 'listening',
        glowColor: 'rgba(141, 207, 169, 0.45)',
        badgeColor: '#8DCFA9',
        title: breathPhase === 'inhale' ? 'Inhale peace...' : breathPhase === 'hold' ? 'Hold gently...' : breathPhase === 'exhale' ? 'Exhale the pressure...' : 'Peace with you',
        vibe: 'Co-Regulating',
        quote: "Taking this moment just for you. You don't have to rush."
      };
    }
    if (convState.currentStage === STAGES.SAFETY) {
      return {
        mode: 'PROTECTIVE',
        orbState: 'hover',
        glowColor: 'rgba(248, 113, 113, 0.5)',
        badgeColor: '#F87171',
        title: "Standing by you · Safe space",
        vibe: "Protective Sanctuary",
        quote: "You don't have to carry this alone. I am standing right beside you."
      };
    }
    if (isTyping) {
      return {
        mode: 'THINKING',
        orbState: 'thinking',
        glowColor: 'rgba(142, 220, 242, 0.45)',
        badgeColor: '#8EDCF2',
        title: "Attuning to your words...",
        vibe: "Deep Attunement",
        quote: "Listening to the nuances of what you shared with care..."
      };
    }
    if (inputValue.trim().length > 0) {
      return {
        mode: 'LISTENING',
        orbState: 'listening',
        glowColor: 'rgba(244, 182, 215, 0.42)',
        badgeColor: '#F4B6D7',
        title: "I'm listening closely",
        vibe: "Holding Space",
        quote: "Take your time. I'm right here listening to you."
      };
    }
    if (convState.handoffComplete) {
      return {
        mode: 'CONNECTED',
        orbState: 'success',
        glowColor: 'rgba(141, 207, 169, 0.45)',
        badgeColor: '#8DCFA9',
        title: "Supported & Connected",
        vibe: "Care Connected",
        quote: "Your consultation is secured. An advisor is on your side."
      };
    }
    if (convState.currentStage === STAGES.SCHEDULE) {
      return {
        mode: 'HOPEFUL',
        orbState: 'hover',
        glowColor: 'rgba(235, 167, 86, 0.45)',
        badgeColor: '#EBA756',
        title: "Opening support pathways",
        vibe: "Clear Direction",
        quote: "Choose a time that fits your life. You don't have to struggle alone."
      };
    }
    if (convState.detectedThemes?.some(t => {
      const lbl = (typeof t === 'string' ? t : (t.label || t.name || '')).toLowerCase();
      return lbl.includes('sleep') || lbl.includes('pressure') || lbl.includes('stress') || lbl.includes('anxiety');
    })) {
      return {
        mode: 'EMPATHY',
        orbState: userHoveredOrb ? 'hover' : 'listening',
        glowColor: 'rgba(199, 184, 245, 0.42)',
        badgeColor: '#C7B8F5',
        title: "Holding space for your pressure",
        vibe: "Empathetic Warmth",
        quote: "Pressure and sleep disruption are exhausting. We are untangling this together."
      };
    }

    return {
      mode: 'GENTLE',
      orbState: userHoveredOrb ? 'hover' : 'idle',
      glowColor: 'rgba(244, 182, 215, 0.28)',
      badgeColor: '#F4B6D7',
      title: "I'm here with you",
      vibe: "Calm Sanctuary",
      quote: "You don't have to figure it all out. Take all the time you need."
    };
  };

  const activeEmotion = getEmotionalPresence();

  const messagesEndRef = useRef(null);

  const starterPrompts = [
    "Book an appointment directly",
    "Exams & coursework",
    "Trouble sleeping or stress",
    "Balancing fees & rent",
    "Just feeling disconnected"
  ];

  const sidebarItemsTop = [
    { id: 'academic', label: 'Academic Support', icon: BookOpen, color: '#8EDCF2' },
    { id: 'counselling', label: 'Counselling & Wellbeing', icon: Heart, color: '#F4B6D7' },
    { id: 'financial', label: 'Financial Assistance', icon: Coins, color: '#EBA756' },
    { id: 'affairs', label: 'Student Affairs', icon: Users, color: '#8EDCF2' },
    { id: 'housing', label: 'Housing & International', icon: Home, color: '#8DCFA9' },
  ];

  const sidebarItemsBottom = [
    { id: 'journey', label: 'My Journey', icon: Compass, route: '/journey' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, route: '/appointments' },
    { id: 'resources', label: 'Resources', icon: BookOpen, route: '/resources' },
  ];

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convState.messages, isTyping, convState.currentStage]);

  // Handle initial prompt if provided
  useEffect(() => {
    if (initialPrompt && convState.messages.length <= 1) {
      handleSend(initialPrompt);
    }
  }, []);

  const handleSend = async (textToSend = null) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (text.toLowerCase().includes('open full calendar') || text.toLowerCase().includes('calendar directory') || text.toLowerCase().includes('view full calendar')) {
      onNavigate('/appointments');
      return;
    }

    if (text.includes('11:00 AM')) {
      handleBookSlot('SLOT-2');
      return;
    }
    if (text.includes('12:30 PM')) {
      handleBookSlot('SLOT-3');
      return;
    }
    if (text.includes('3:30 PM')) {
      handleBookSlot('SLOT-4');
      return;
    }

    setInputValue('');
    setIsTyping(true);
    setOrbState('thinking');
    setProgressPhrase("Connecting with support coordinates...");

    try {
      const response = await postChatMessage({
        conversationId: convState.conversationId,
        message: text
      });

      setConvState({ ...response.fullState });
      setProgressPhrase(response.progress || "Looking for the right kind of support...");
      setOrbState(response.stage === STAGES.JOURNEY ? 'handoff' : 'responding');
      setTimeout(() => setOrbState('idle'), 2200);
    } catch (e) {
      console.error('Conversation processing error:', e);
    } finally {
      setIsTyping(false);
      setProgressPhrase('');
    }
  };

  // AI Mirror Actions (Section 13 & 14)
  const handleConfirmMirror = () => {
    setOrbState('thinking');
    const updated = confirmStudentMirror('CONFIRMED');
    setConvState({ ...updated });
    setOrbState('idle');
  };

  const handleStartEditMirror = () => {
    setIsEditingMirror(true);
    setEditableSummary(convState.provisionalSummary || convState.aiMirrorPoints?.join('\n• ') || '');
  };

  const handleSaveEditMirror = () => {
    setIsEditingMirror(false);
    setOrbState('thinking');
    const updated = confirmStudentMirror('EDIT', editableSummary);
    setConvState({ ...updated });
    setOrbState('idle');
  };

  const handleNotQuiteMirror = () => {
    setOrbState('thinking');
    const updated = confirmStudentMirror('NOT_QUITE');
    setConvState({ ...updated });
    setOrbState('idle');
  };

  // Pathway Selection (Section 15 & 16)
  const handleSelectPathway = (depts) => {
    setOrbState('thinking');
    const updated = selectSupportPathway(depts);
    setConvState({ ...updated });
    setOrbState('idle');
  };

  // Appointment Booking (Section 18 & 19)
  const handleBookSlot = (slotId) => {
    setOrbState('thinking');
    setProgressPhrase("Reserving consultation & connecting specialist...");
    setTimeout(() => {
      const { state: updated } = bookConversationalAppointment(slotId);
      setConvState({ ...updated });
      setProgressPhrase('');
      setOrbState('handoff');
    }, 600);
  };

  const handleNewConversation = () => {
    const fresh = resetConversation();
    setConvState({ ...fresh });
    setInputValue('');
  };

  const handleVoiceToggle = () => {
    if (!isListeningVoice) {
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListeningVoice(true);
          setOrbState('listening');
        };

        recognition.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          setIsListeningVoice(false);
          setOrbState('idle');
          if (transcript) {
            handleSend(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListeningVoice(false);
          setOrbState('idle');
        };

        recognition.onend = () => {
          setIsListeningVoice(false);
          setOrbState('idle');
        };

        try {
          recognition.start();
        } catch (e) {
          setIsListeningVoice(false);
          setOrbState('idle');
        }
      } else {
        // Fallback simulation for environments without Web Speech API
        setIsListeningVoice(true);
        setOrbState('listening');
        setTimeout(() => {
          setInputValue("exams are coming up and I'm struggling.");
          setIsListeningVoice(false);
          setOrbState('idle');
        }, 1800);
      }
    } else {
      setIsListeningVoice(false);
      setOrbState('idle');
    }
  };

  const filteredSlots = filterAppointmentOptions(scheduleFilter);

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 270px) 1fr minmax(260px, 310px)',
        minHeight: 'calc(100vh - 80px)',
        marginTop: '80px',
        backgroundColor: '#0B0B0E',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* ======================================================== */}
      {/* LEFT SIDEBAR: NEW CHAT & CAMPUS GRAPH */}
      {/* ======================================================== */}
      <aside 
        style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(15, 15, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* New Chat Button */}
          <button
            onClick={handleNewConversation}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              outline: 'none',
              color: '#FAF8F5',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'background 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          >
            <div 
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(244, 182, 215, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={15} color="#F4B6D7" />
            </div>
            <span>New Conversation</span>
          </button>

          {/* Department items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px 8px' }}>
              Campus Support Graph
            </span>
            {sidebarItemsTop.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                    color: isActive ? '#FAF8F5' : '#B8B3AA',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <IconComp size={15} color={isActive ? item.color : '#78746C'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom items */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sidebarItemsBottom.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.route)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#B8B3AA',
                  fontSize: '13px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF8F5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#B8B3AA')}
              >
                <IconComp size={15} color="#EBA756" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* CENTER WORKSPACE: CONVERSATION FLOW */}
      {/* ======================================================== */}
      <main 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.5rem, 3.5vw, 3rem)',
          position: 'relative',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 80px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Quick Direct Appointment Option Banner */}
          {!convState.handoffComplete && convState.currentStage !== STAGES.SCHEDULE && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'rgba(235, 167, 86, 0.08)',
                border: '1px solid rgba(235, 167, 86, 0.18)',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FAF8F5' }}>
                <Calendar size={15} color="#EBA756" />
                <span><strong>Chatting is optional:</strong> Need to schedule confidential care directly?</span>
              </div>
              <button
                type="button"
                onClick={() => handleSend("i wanna book an appointment")}
                style={{
                  background: 'rgba(235, 167, 86, 0.16)',
                  border: 'none',
                  color: '#EBA756',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Book an appointment directly →</span>
              </button>
            </div>
          )}

          {/* Messages list */}
          {convState.messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '84%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div 
                  className={isUser ? '' : 'glass-panel'}
                  style={{
                    padding: '16px 22px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isUser ? 'rgba(38, 36, 52, 0.92)' : 'rgba(22, 21, 30, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#FAF8F5',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {m.text}
                </div>

                {/* Adaptive follow-up option pills (Section 8) */}
                {m.options && m.options.length > 0 && !convState.handoffComplete && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                    {m.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(opt)}
                        style={{
                          background: 'rgba(244, 182, 215, 0.08)',
                          border: 'none',
                          outline: 'none',
                          color: '#F4B6D7',
                          fontSize: '12.5px',
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          cursor: 'pointer',
                          fontWeight: 500,
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 182, 215, 0.16)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(244, 182, 215, 0.08)')}
                      >
                        {opt} →
                      </button>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '11px', color: '#78746C', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                  {m.time}
                </span>
              </div>
            );
          })}

          {/* Progress Indicator (Section 39) */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#B8B3AA', fontSize: '13.5px', padding: '12px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <RefreshCw size={15} className="animate-spin" color="#EBA756" />
              <span>{progressPhrase || "Understanding what you're dealing with..."}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 11: CONTINUOUS SAFETY CRISIS CARD */}
          {/* ======================================================== */}
          {convState.currentStage === STAGES.SAFETY && (
            <div 
              style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                animation: 'fadeIn 200ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <AlertTriangle size={20} color="#F87171" />
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#F87171' }}>
                  Immediate Crisis Support Available 24/7
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#FAF8F5', lineHeight: 1.6, marginBottom: '14px' }}>
                Based on what you've shared, you may benefit from speaking directly with an urgent care professional. You don't have to carry this alone.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', fontSize: '13px' }}>
                  <strong style={{ color: '#FAF8F5' }}>Campus 24/7 Crisis Urgent Line</strong>
                  <span style={{ color: '#F87171', fontWeight: 600 }}>1-800-273-TALK</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', fontSize: '13px' }}>
                  <strong style={{ color: '#FAF8F5' }}>Crisis Text Line</strong>
                  <span style={{ color: '#F87171', fontWeight: 600 }}>Text HOME to 741741</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('/appointments')}
                className="btn-warm"
                style={{ background: '#F87171', color: '#0B0B0E', fontSize: '13px' }}
              >
                <span>Connect with Urgent Wellbeing Specialist</span>
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 13 & 14: AI MIRROR CARD ("Here's what I understood") */}
          {/* ======================================================== */}
          {convState.currentStage === STAGES.CONFIRM && (
            <div 
              className="glass-panel"
              style={{
                padding: '26px 28px',
                borderRadius: '20px',
                background: 'rgba(24, 23, 34, 0.88)',
                border: '1px solid rgba(244, 182, 215, 0.25)',
                animation: 'fadeIn 250ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={16} color="#F4B6D7" />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#F4B6D7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  AI Mirror · What HERE Understood
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 600 }}>
                YOU'VE SHARED:
              </div>

              {!isEditingMirror ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                  {(convState.aiMirrorPoints || []).map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#FAF8F5', lineHeight: 1.5 }}>
                      <span style={{ color: '#F4B6D7', marginTop: '2px' }}>•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <textarea
                    value={editableSummary}
                    onChange={(e) => setEditableSummary(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(12, 12, 16, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FAF8F5',
                      fontSize: '13.5px',
                      lineHeight: 1.5,
                      outline: 'none',
                      resize: 'none',
                      marginBottom: '10px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSaveEditMirror} className="btn-primary" style={{ fontSize: '12.5px', padding: '8px 16px' }}>
                      Save changes
                    </button>
                    <button onClick={() => setIsEditingMirror(false)} style={{ background: 'transparent', border: 'none', color: '#B8B3AA', fontSize: '12.5px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5', marginBottom: '14px' }}>
                Did I get that right?
              </div>

              {!isEditingMirror && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <button onClick={handleConfirmMirror} className="btn-primary" style={{ fontSize: '13px', padding: '10px 18px' }}>
                    <Check size={15} />
                    <span>YES, THAT'S RIGHT</span>
                  </button>

                  <button onClick={handleStartEditMirror} className="btn-secondary" style={{ fontSize: '13px', padding: '10px 16px' }}>
                    <Edit3 size={14} />
                    <span>EDIT SOMETHING</span>
                  </button>

                  <button onClick={handleNotQuiteMirror} style={{ background: 'transparent', border: 'none', color: '#B8B3AA', fontSize: '13px', cursor: 'pointer', padding: '10px 14px' }}>
                    Not quite
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 15 & 16: SUPPORT RECOMMENDATIONS */}
          {/* ======================================================== */}
          {convState.currentStage === STAGES.RECOMMEND && (
            <div 
              className="glass-panel"
              style={{
                padding: '26px 28px',
                borderRadius: '20px',
                background: 'rgba(24, 23, 34, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                animation: 'fadeIn 250ms ease'
              }}
            >
              <div style={{ fontSize: '13px', color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', fontWeight: 600 }}>
                Recommended University Support Coordinates:
              </div>

              <p style={{ fontSize: '13.5px', color: '#B8B3AA', marginBottom: '16px' }}>
                You can choose one, or connect with both.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                {(convState.recommendedServices && convState.recommendedServices.length > 0 ? convState.recommendedServices : [
                  {
                    id: 'counselling',
                    department: 'Counselling & Mental Wellbeing',
                    title: 'Counselling & Wellbeing',
                    description: 'Support with stress, wellbeing and personal concerns.',
                    reason: 'Because you’ve mentioned ongoing pressure and sleep difficulties.',
                    lead: 'Dr. Sarah Jenkins'
                  },
                  {
                    id: 'academic',
                    department: 'Academic Support & Tutoring',
                    title: 'Academic Support',
                    description: 'Help with study pressure, workload and academic planning.',
                    reason: 'Because the main source of pressure appears to be your upcoming exams.',
                    lead: 'Marcus Vance'
                  }
                ]).map((svc) => (
                  <div 
                    key={svc.id}
                    style={{ 
                      padding: '18px', 
                      borderRadius: '16px', 
                      background: svc.id === 'counselling' ? 'rgba(244, 182, 215, 0.08)' : 'rgba(142, 220, 242, 0.08)', 
                      border: `1px solid ${svc.id === 'counselling' ? 'rgba(244, 182, 215, 0.25)' : 'rgba(142, 220, 242, 0.25)'}` 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {svc.id === 'counselling' ? <Heart size={16} color="#F4B6D7" /> : <BookOpen size={16} color="#8EDCF2" />}
                      <strong style={{ fontSize: '15px', color: '#FAF8F5' }}>{svc.title}</strong>
                    </div>

                    <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.45, marginBottom: '10px' }}>
                      {svc.description}
                    </p>

                    {/* Section 15 Rationale */}
                    <div style={{ fontSize: '12px', color: svc.id === 'counselling' ? '#F4B6D7' : '#8EDCF2', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '8px', marginBottom: '14px', lineHeight: 1.4 }}>
                      <strong>Why:</strong> {svc.reason || 'Directly aligned with your shared conversation.'}
                    </div>

                    <button 
                      onClick={() => handleSelectPathway(svc.department)}
                      className={svc.id === 'counselling' ? 'btn-primary' : 'btn-secondary'}
                      style={{ fontSize: '12.5px', padding: '9px 14px', width: '100%', justifyContent: 'center' }}
                    >
                      Connect with {svc.title}
                    </button>
                  </div>
                ))}
              </div>

              {(convState.recommendedServices?.length || 2) >= 2 && (
                <button
                  onClick={() => handleSelectPathway(convState.recommendedServices?.map(s => s.department) || ['Counselling & Mental Wellbeing', 'Academic Support & Tutoring'])}
                  className="btn-warm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '11px' }}
                >
                  <span>Connect with All Recommended Coordinates (Coordinated Pathway)</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 18 & 19: CONVERSATIONAL APPOINTMENT SCHEDULING */}
          {/* ======================================================== */}
          {convState.currentStage === STAGES.SCHEDULE && (
            <div 
              className="glass-panel"
              style={{
                padding: '26px 28px',
                borderRadius: '20px',
                background: 'rgba(24, 23, 34, 0.88)',
                border: '1px solid rgba(235, 167, 86, 0.25)',
                animation: 'fadeIn 250ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="#EBA756" />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Select a Convenient Consultation Time
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'today', label: 'Today' },
                    { id: 'tomorrow_afternoon', label: 'Tomorrow afternoon' },
                    { id: 'all', label: 'All options' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setScheduleFilter(tab.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: scheduleFilter === tab.id ? 600 : 400,
                        background: scheduleFilter === tab.id ? 'rgba(235, 167, 86, 0.2)' : 'rgba(255,255,255,0.04)',
                        color: scheduleFilter === tab.id ? '#EBA756' : '#B8B3AA',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#B8B3AA', lineHeight: 1.5, marginBottom: '14px' }}>
                Found {filteredSlots.length} available confidential slots for <strong>{convState.selectedDepartments?.[0] || 'Counselling & Mental Wellbeing'}</strong>:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                {filteredSlots.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => handleBookSlot(slot.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(235, 167, 86, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(235, 167, 86, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#EBA756', fontWeight: 600, textTransform: 'uppercase' }}>
                      {slot.day} · {slot.period}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#FAF8F5', margin: '4px 0' }}>
                      {slot.time}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#B8B3AA' }}>
                      {slot.modality}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8DCFA9', marginTop: '6px' }}>
                      Advisor: {slot.counsellor}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '11.5px', color: '#78746C', textAlign: 'center' }}>
                Prefer a different modality or later week? Click any slot above or let HERE suggest.
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 24: BEAUTIFUL AI → HUMAN HANDOFF MOMENT */}
          {/* ======================================================== */}
          {convState.handoffComplete && (
            <div 
              className="glass-panel"
              style={{
                padding: '30px',
                borderRadius: '24px',
                background: 'rgba(18, 28, 22, 0.88)',
                border: '1px solid rgba(141, 207, 169, 0.35)',
                animation: 'fadeIn 300ms ease'
              }}
            >
              {/* Handoff Transition Pill Badge */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(141, 207, 169, 0.15)',
                  color: '#8DCFA9',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  letterSpacing: '0.04em'
                }}
              >
                <Sparkles size={14} />
                <span>AI → HUMAN CARE HANDOFF COMPLETE</span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 650, color: '#FAF8F5', marginBottom: '8px' }}>
                You don't have to figure out the next step alone.
              </h3>

              <p style={{ fontSize: '14.5px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '18px' }}>
                Your request has been connected to <strong style={{ color: '#FAF8F5' }}>{convState.appointmentBooked?.counsellor || 'Dr. Sarah Jenkins'}</strong> from <strong style={{ color: '#8EDCF2' }}>{convState.appointmentBooked?.dept || 'Counselling & Mental Wellbeing'}</strong>.
              </p>

              {/* Consultation detail card */}
              <div style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '6px' }}>
                  <span style={{ color: '#78746C' }}>Consultation Reserved:</span>
                  <strong style={{ color: '#FAF8F5' }}>
                    {convState.appointmentBooked?.day || 'Tomorrow'} at {convState.appointmentBooked?.time || '3:30 PM'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '6px' }}>
                  <span style={{ color: '#78746C' }}>Support File ID:</span>
                  <strong style={{ color: '#EBA756' }}>#{convState.createdCaseId || 'CASE-2026-00142'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#78746C' }}>Status:</span>
                  <span style={{ color: '#8DCFA9', fontWeight: 600 }}>● Assigned to counsellor · Summary Approved</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={() => onNavigate('/journey')}
                  className="btn-primary"
                  style={{ fontSize: '13.5px', padding: '10px 22px' }}
                >
                  <span>Open My Journey Timeline →</span>
                </button>

                <button
                  onClick={() => onNavigate('/resources')}
                  className="btn-warm"
                  style={{ fontSize: '13.5px', padding: '10px 20px' }}
                >
                  <span>Explore Calming Bridge Resources</span>
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Main Input Box */}
          <div 
            className="glass-panel"
            style={{
              position: 'relative',
              borderRadius: '18px',
              padding: '14px 18px',
              background: 'rgba(22, 21, 30, 0.88)',
              border: isListeningVoice ? '1px solid #8EDCF2' : '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Real-time Attuned Companion Listening Indicator */}
            {inputValue.trim().length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#F4B6D7', marginBottom: '8px', opacity: 0.9 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F4B6D7', display: 'inline-block', animation: 'companionPulse 1.2s infinite' }} />
                <span>HERE companion is attuned & listening closely to you...</span>
              </div>
            )}

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListeningVoice ? "Listening to your voice..." : "Share what’s going on in your own words…"}
              rows={3}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FAF8F5',
                fontSize: '15px',
                lineHeight: 1.5,
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />

            {/* Input Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
              <button
                onClick={handleVoiceToggle}
                style={{
                  background: isListeningVoice ? 'rgba(142,220,242,0.2)' : 'none',
                  border: 'none',
                  color: isListeningVoice ? '#8EDCF2' : '#B8B3AA',
                  borderRadius: '9999px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Mic size={15} />
                <span>{isListeningVoice ? "Listening..." : "Voice input"}</span>
              </button>

              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: inputValue.trim() ? '#F4B6D7' : 'rgba(255, 255, 255, 0.08)',
                  color: inputValue.trim() ? '#101626' : '#78746C',
                  border: 'none',
                  outline: 'none',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Ideas to start - ONLY shown before student sends any message */}
          {convState.messages.filter(m => m.sender === 'user').length === 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#78746C', alignSelf: 'center', marginRight: '4px' }}>
                Ideas to start:
              </span>
              {starterPrompts.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="btn-pill-chip"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Privacy Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#78746C', padding: '4px 2px' }}>
            <Lock size={12} color="#8DCFA9" />
            <span>FERPA protected. Conversations remain private until you approve the AI care summary.</span>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* RIGHT SIDEBAR: ORB & CONTEXTUAL PROGRESS TRACKER */}
      {/* ======================================================== */}
      <aside 
        style={{
          borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(15, 15, 20, 0.65)',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div>
          {/* Assistant Emotion Badge & Speech Bubble */}
          <div 
            className="glass-panel"
            style={{
              padding: '16px 18px',
              borderRadius: '18px',
              marginBottom: '1.25rem',
              maxWidth: '260px',
              textAlign: 'left',
              fontSize: '13px',
              lineHeight: 1.5,
              color: '#B8B3AA',
              background: 'rgba(24, 23, 34, 0.88)',
              border: `1px solid ${activeEmotion.badgeColor}33`,
              boxShadow: `0 8px 24px ${activeEmotion.glowColor}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ 
                width: '7px', 
                height: '7px', 
                borderRadius: '50%', 
                backgroundColor: activeEmotion.badgeColor,
                display: 'inline-block',
                boxShadow: `0 0 8px ${activeEmotion.badgeColor}`
              }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: activeEmotion.badgeColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {activeEmotion.vibe}
              </span>
            </div>
            <strong style={{ color: '#FAF8F5', fontSize: '13.5px', display: 'block', marginBottom: '4px' }}>
              {activeEmotion.title}
            </strong>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontStyle: 'italic', display: 'block' }}>
              "{activeEmotion.quote}"
            </span>
          </div>

          {/* 3D WebGL Assistant Orb with Dynamic Emotional Aura & Guided Breathing */}
          <div 
            className="companion-orb-wrapper"
            style={{ 
              marginBottom: '1rem', 
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={handleStartBreathing}
            onMouseEnter={() => setUserHoveredOrb(true)}
            onMouseLeave={() => setUserHoveredOrb(false)}
            title="Click orb to start a gentle grounding breath cycle"
          >
            {/* Dynamic Radial Ambient Aura */}
            <div 
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${activeEmotion.glowColor} 0%, transparent 70%)`,
                filter: 'blur(24px)',
                pointerEvents: 'none',
                transition: 'all 800ms ease',
                zIndex: 0
              }} 
            />

            {/* Breathing Ring when active */}
            {breathActive && (
              <div 
                style={{
                  position: 'absolute',
                  width: '145px',
                  height: '145px',
                  borderRadius: '50%',
                  border: `2px dashed ${activeEmotion.badgeColor}`,
                  pointerEvents: 'none',
                  animation: breathPhase === 'inhale' ? 'orbBreathRingInhale 4s ease-out forwards' : breathPhase === 'exhale' ? 'orbBreathRingExhale 4s ease-in forwards' : 'none',
                  zIndex: 1
                }}
              />
            )}

            <div style={{ position: 'relative', zIndex: 2 }}>
              <AssistantOrb 
                state={activeEmotion.orbState}
                size={120}
                groundShadow={true}
              />
            </div>
          </div>

          {/* Interactive Breathing Reset Trigger Button */}
          <button
            type="button"
            onClick={handleStartBreathing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: breathActive ? 'rgba(141, 207, 169, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${breathActive ? '#8DCFA9' : 'rgba(255,255,255,0.08)'}`,
              color: breathActive ? '#8DCFA9' : '#B8B3AA',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '1.25rem',
              transition: 'all 200ms ease'
            }}
          >
            <span>{breathActive ? `🌬️ ${activeEmotion.title}` : '🌬️ Click orb to breathe with me'}</span>
          </button>

          {/* Real-time Contextual Extracted Knowledge */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '14px',
              textAlign: 'left',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Understanding
              </span>
              <span style={{ fontSize: '10px', color: '#8EDCF2', background: 'rgba(142,220,242,0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                {convState.engineMode || 'DEMO FALLBACK'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78746C' }}>Stage:</span>
                <span style={{ color: '#EBA756', fontWeight: 600 }}>{convState.currentStage}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78746C' }}>Urgency:</span>
                <span style={{ color: convState.urgency === 'AMBER' ? '#EBA756' : convState.urgency === 'RED' ? '#F87171' : '#8DCFA9', fontWeight: 600 }}>
                  {convState.urgency}
                </span>
              </div>

              {convState.knownInformation?.duration && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#78746C' }}>Duration:</span>
                  <span style={{ color: '#FAF8F5' }}>{convState.knownInformation.duration}</span>
                </div>
              )}

              {convState.detectedThemes?.length > 0 && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ color: '#78746C', marginBottom: '4px' }}>Detected Themes:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {convState.detectedThemes.map((t, idx) => {
                      const label = typeof t === 'string' ? t : (t.label || t.name);
                      const conf = typeof t === 'object' && t.confidence ? ` ${Math.round(t.confidence * 100)}%` : '';
                      return (
                        <span key={idx} style={{ fontSize: '10.5px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}>
                          {label}{conf}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Protection footer */}
        <div style={{ fontSize: '11.5px', color: '#78746C', padding: '0 8px' }}>
          <ShieldCheck size={14} color="#8DCFA9" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          Encrypted university student privacy standard
        </div>
      </aside>
    </div>
  );
}
