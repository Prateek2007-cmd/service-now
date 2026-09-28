import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  ChevronRight, 
  X, 
  Clock, 
  Sparkles, 
  Heart,
  Wind,
  PhoneCall,
  Shield,
  MapPin,
  Play,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

/**
 * Short spoken cue for each phase of the 4-7-8 rhythm.
 *
 * A breathing guide is followed with eyes closed, so a purely visual prompt
 * is unusable. Uses the Web Speech API, which needs no asset and degrades to
 * silence where unsupported -- the on-screen countdown still carries it.
 */
function speakCue(text) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1;
    u.volume = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* audio is a nice-to-have; never let it break the exercise */
  }
}

export default function ResourcesSection({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale (4s), Hold (7s), Exhale (8s)
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  const PHASE_SECONDS = { Inhale: 4, Hold: 7, Exhale: 8 };
  const NEXT_PHASE = { Inhale: 'Hold', Hold: 'Exhale', Exhale: 'Inhale' };

  // Breathing guide (4-7-8). Two effects on purpose: one ticks the visible
  // countdown every second, the other advances the phase. A single timer only
  // changed the phase, so the number on screen never moved -- it just sat at
  // "4" for four seconds, then jumped to "7".
  useEffect(() => {
    if (!breathingActive) return;
    const id = setInterval(() => {
      setBreathSeconds(prev => {
        if (prev > 1) return prev - 1;
        return PHASE_SECONDS[NEXT_PHASE[breathPhase]];
      });
    }, 1000);
    return () => clearInterval(id);
  }, [breathingActive, breathPhase]);

  useEffect(() => {
    if (!breathingActive) return;
    speakCue(breathPhase);
    const id = setTimeout(() => {
      setBreathPhase(prev => {
        if (prev === 'Exhale') setBreathCycles(n => n + 1);
        return NEXT_PHASE[prev];
      });
      setBreathSeconds(PHASE_SECONDS[NEXT_PHASE[breathPhase]]);
    }, PHASE_SECONDS[breathPhase] * 1000);
    return () => clearTimeout(id);
  }, [breathingActive, breathPhase]);

  // Reset the cycle count when the exercise is stopped, not when it restarts.
  const toggleBreathing = () => {
    setBreathingActive(prev => {
      if (prev) {
        setBreathCycles(0);
        setBreathPhase('Inhale');
        setBreathSeconds(4);
        try { window.speechSynthesis?.cancel(); } catch (e) { /* ignore */ }
      }
      return !prev;
    });
  };

  const filters = [
    'All',
    'Exam Relief',
    'Mental Wellbeing',
    'Financial Grants',
    'Sleep & Rest',
    'Campus Life',
  ];

  const resources = [
    {
      id: 1,
      title: 'The 72-Hour Exam Panic Reset Protocol',
      category: 'Exam Relief',
      type: 'Immediate Guide',
      duration: '4 min read',
      icon: BookOpen,
      accentColor: '#F4B6D7',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      summary: 'Grounded physiological tools to de-escalate acute panic, break the syllabus down, and secure mitigating accommodations.',
      content: 'When exam panic strikes, your nervous system interprets impending test failure as physical danger. First, trigger the mammalian dive reflex by splashing cold water on your temples. Second, employ 25-minute Pomodoro study intervals with zero multi-tasking. Third, use our pre-drafted extension petition template to email your departmental tutor.',
    },
    {
      id: 2,
      title: 'Sleep Architecture Reset for Burnout',
      category: 'Sleep & Rest',
      type: 'Audio Reset',
      duration: '8 min audio',
      icon: Video,
      accentColor: '#EBA756',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      summary: 'A calming audio guide designed to release deadline racing thoughts and induce deep restorative sleep.',
      content: 'Sleep deprivation compounds cognitive panic. In this session, learn how to physically separate your study desk from your bed, employ the 10-minute mental brain dump before closing your eyes, and lower room temperature to activate melatonin production naturally.',
    },
    {
      id: 3,
      title: 'Student Hardship Grant Application Playbook',
      category: 'Financial Grants',
      type: 'Step-by-Step',
      duration: '6 min read',
      icon: FileText,
      accentColor: '#8DCFA9',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      summary: 'How to claim emergency university hardship funds, grocery vouchers, and semester fee deferrals without shame.',
      content: 'Every university maintains non-repayable discretionary emergency funds for students facing sudden rent spikes, lost shifts, or medical expenses. Learn what supporting documentation to submit and how to expedite committee review within 48 hours.',
    },
    {
      id: 4,
      title: 'How to Ask for a Deadline Extension Without Shame',
      category: 'Exam Relief',
      type: 'Script & Template',
      duration: '3 min read',
      icon: BookOpen,
      accentColor: '#F4B6D7',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
      summary: 'Copy-pasteable email templates tested with university faculty that communicate distress professionally.',
      content: 'Professors are human too, but receiving vague emails 10 minutes before a deadline causes friction. This guide includes 3 proven email templates that clearly cite mitigating circumstances while proposing a realistic revised submission date.',
    },
    {
      title: 'Naming What You Feel Without Self-Blame',
      category: 'Mental Wellbeing',
      type: 'Guide',
      duration: '5 min read',
      icon: Heart,
      accentColor: '#C7B8F5',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
      summary: 'How to describe a feeling accurately enough that someone can actually help, without turning it into a self-indictment.',
      content: 'Most people describe a feeling with a judgement attached: "I am failing", "I am broken". Staff cannot act on that, because it describes a verdict rather than an experience. Replace the verdict with the observation: "I have not been able to concentrate for two weeks and I am avoiding my flatmates". Say the duration, say what changed, say what it stops you doing. That is what a counsellor needs, and it is far easier to say than it sounds.',
    },
    {
      title: 'When You Do Not Want to Say It Out Loud',
      category: 'Mental Wellbeing',
      type: 'Guide',
      duration: '4 min read',
      icon: Shield,
      accentColor: '#C7B8F5',
      image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=600&q=80',
      summary: 'Writing it down, sending it to the portal, or asking a friend to speak for you are all legitimate first steps.',
      content: 'Speaking to a counsellor in person is the hardest version of this, and it is not the only one. You can type it into the HERE chat at 2am. You can write it and not send it. You can nominate a Quiet Buddy to walk with you to the appointment. All of these are real first contacts, not lesser versions of the real thing.',
    },
    {
      title: 'Finding a Counsellor and a Quiet Space on Campus',
      category: 'Campus Life',
      type: 'Directory',
      duration: '2 min read',
      icon: MapPin,
      accentColor: '#8DCFA9',
      image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=600&q=80',
      summary: 'Where support actually sits on campus, when it is open, and how to reach it without an appointment.',
      content: 'The Counselling suite in the Student Union takes walk-ins during drop-in hours, no appointment needed. The multi-faith centre and the Students Union Advice Office both have staff trained to listen without referring you straight to a form. If you only need somewhere quiet to sit for twenty minutes, the union common room is staffed and nobody will ask you why you are there.',
    },
    {
      title: 'Coping When Your Courseload Does Not Move',
      category: 'Campus Life',
      type: 'Guide',
      duration: '5 min read',
      icon: BookOpen,
      accentColor: '#8DCFA9',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      summary: 'The honest triage when you cannot drop modules, and which levers are actually still available.',
      content: 'If the deadline is immovable, triage ruthlessly: protect the modules with a clinical component, drop one optional item without guilt, and go to the module tutor on record. A documented conversation is the only thing that creates an option later. Reducing your load is not admitting defeat, it is what the people who finish do.',
    },
  ];

  const filtered = resources.filter(res => {
    const matchesFilter = activeFilter === 'All' || res.category === activeFilter;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const searchable = `${res.title} ${res.summary} ${res.content} ${res.category}`.toLowerCase();
    
    // Conceptual & semantic synonyms
    const synonyms = {
      'concentrate': ['exam', 'panic', 'study', 'extension', 'focus'],
      'concentration': ['exam', 'panic', 'study', 'focus'],
      'money': ['financial', 'hardship', 'grant', 'fund', 'fee'],
      'broke': ['financial', 'hardship', 'grant', 'fund'],
      'rent': ['financial', 'hardship', 'grant'],
      'tired': ['sleep', 'burnout', 'rest'],
      'insomnia': ['sleep', 'burnout', 'rest'],
      'late': ['extension', 'deadline', 'template'],
      'fail': ['exam', 'panic', 'extension', 'protocol'],
      'alone': ['burnout', 'reset', 'calm'],
    };

    if (searchable.includes(q)) return true;

    for (const [key, synList] of Object.entries(synonyms)) {
      if (q.includes(key)) {
        if (synList.some(s => searchable.includes(s))) return true;
      }
    }
    return false;
  });

  return (
    <section 
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0F0F14',
        overflow: 'hidden',
      }}
    >
      {/* Warm Ambient Sage & Amber Lights */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(141, 207, 169, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: '3.5rem' }}>
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
            <Sparkles size={15} />
            <span>Student Relief Toolkit</span>
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
            Practical tools to help you <br />
            <span style={{ color: '#EBA756', fontStyle: 'italic' }}>catch your breath</span> right now.
          </h2>

          <p 
            style={{
              fontSize: 'clamp(15px, 1.15vw, 17px)',
              lineHeight: 1.65,
              color: '#B8B3AA',
            }}
          >
            No dense administrative jargon. Instant audio resets, proven scripts for tutors, and financial survival guides created by student psychologists.
          </p>
        </div>

        {/* Live Interactive 3-Minute Breathing Sanctuary Widget */}
        <div 
          className="glass-panel"
          style={{
            padding: '28px 32px',
            borderRadius: '24px',
            background: 'linear-gradient(160deg, rgba(26, 25, 34, 0.85) 0%, rgba(18, 17, 24, 0.95) 100%)',
            marginBottom: '3.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', maxWidth: '560px' }}>
            {/* Animated Breathing Circle */}
            <div 
              style={{
                position: 'relative',
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: breathingActive ? 'rgba(141, 207, 169, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 500ms ease',
                boxShadow: breathingActive ? '0 0 24px rgba(141, 207, 169, 0.35)' : 'none',
              }}
            >
              <Wind 
                size={28} 
                color={breathingActive ? '#8DCFA9' : '#B8B3AA'} 
                style={{
                  transform: breathingActive && breathPhase === 'Inhale' ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 3s ease',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FAF8F5' }}>
                  {breathingActive ? `${breathPhase}... (${breathSeconds}s)` : 'Need an instant de-escalation reset?'}
                </h3>
                {breathingActive && (
                  <span style={{ fontSize: '11px', background: 'rgba(141, 207, 169, 0.2)', color: '#8DCFA9', padding: '2px 8px', borderRadius: '9999px' }}>
                    4-7-8 Rhythm · cycle {breathCycles + 1}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13.5px', color: '#B8B3AA', marginTop: '4px', lineHeight: 1.5 }}>
                {breathingActive 
                  ? 'Follow the rhythm. Release tension from your jaw, shoulders, and brow.' 
                  : 'Start a gentle 4-7-8 breathing exercise designed to calm the nervous system in under 2 minutes.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={toggleBreathing}
              className={breathingActive ? "btn-secondary" : "btn-warm"}
              style={{
                fontSize: '13.5px',
                padding: '10px 22px',
              }}
            >
              {breathingActive ? 'Pause Exercise' : 'Start 4-7-8 Breathing'}
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeFilter === f ? 600 : 400,
                  background: activeFilter === f ? '#FAF8F5' : 'rgba(255, 255, 255, 0.04)',
                  color: activeFilter === f ? '#0B0B0E' : '#B8B3AA',
                  transition: 'all 200ms ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div 
            style={{
              position: 'relative',
              minWidth: '260px',
            }}
          >
            <Search size={16} color="#78746C" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, bursaries, scripts..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                outline: 'none',
                borderRadius: '9999px',
                color: '#FAF8F5',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        {/* Resources — full guide shown inline, no modal */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.75rem',
            alignItems: 'start',
          }}
        >
          {filtered.map((item) => {
            const IconComp = item.icon;
            return (
              <article
                key={item.id}
                className="glass-panel"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'rgba(24, 23, 32, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Cover */}
                <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(20, 20, 28, 0.95) 100%)',
                    }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: 'rgba(15, 15, 20, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: item.accentColor,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                    }}
                  >
                    {item.type}
                  </span>
                  <span 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: 'rgba(15, 15, 20, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: '#B8B3AA',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={12} />
                    <span>{item.duration}</span>
                  </span>
                </div>

                {/* Body Content — the whole guide, readable in place */}
                <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FAF8F5', marginBottom: '8px', lineHeight: 1.35 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#B8B3AA', lineHeight: 1.55, marginBottom: '16px' }}>
                    {item.summary}
                  </p>

                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                      paddingTop: '16px',
                    }}
                  >
                    <p style={{ fontSize: '14.5px', color: '#E8E4DC', lineHeight: 1.75, margin: 0 }}>
                      {item.content}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: '18px',
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: item.accentColor,
                      fontWeight: 600,
                    }}
                  >
                    <IconComp size={14} />
                    <span>{item.category}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

    </section>
  );
}
