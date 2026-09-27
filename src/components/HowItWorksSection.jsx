import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CalendarClock, 
  HeartHandshake, 
  CheckCircle2,
  Lock,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function HowItWorksSection({ onNavigate }) {
  const [activeScenario, setActiveScenario] = useState('exam');

  const scenarios = {
    exam: {
      label: "Failing exams & panic",
      prompt: "I'm 3 weeks behind on coursework, haven't slept properly, and having panic attacks before exams.",
      resolution: [
        { title: "Immediate Crisis Support", note: "Connected with Wellbeing triage & grounding toolkit in under 2 mins", color: "#F4B6D7" },
        { title: "Emergency Academic Extension", note: "Automated official request drafted for course convenor", color: "#EBA756" },
        { title: "1-on-1 Peer Coaching", note: "Paired with a 4th-year study mentor who faced the same syllabus", color: "#8DCFA9" },
      ],
      timeToRelief: "Immediate relief in 2 minutes",
    },
    financial: {
      label: "Cannot afford rent/food",
      prompt: "My part-time shift was cut and I can't afford next week's rent or groceries.",
      resolution: [
        { title: "Student Emergency Grant", note: "$500 immediate discretionary bursary application without credit checks", color: "#EBA756" },
        { title: "Campus Pantry Access", note: "Discreet confidential grocery voucher token loaded to your student ID", color: "#8DCFA9" },
        { title: "Financial Aid Advisor", note: "Confidential session scheduled to restructure tuition instalments", color: "#F4B6D7" },
      ],
      timeToRelief: "Funds expedited in 24–48 hours",
    },
    mental: {
      label: "Severe isolation & burnout",
      prompt: "I feel completely invisible on campus. I haven't left my dorm room in 4 days.",
      resolution: [
        { title: "Anonymous Listening Circle", note: "Zero-pressure peer support channel with verified fellow students", color: "#8DCFA9" },
        { title: "Licensed Counselling Match", note: "Private, free session with a cross-cultural student counsellor", color: "#F4B6D7" },
        { title: "Wellbeing Check-in Care", note: "Daily gentle check-in reminders with personal follow-through", color: "#C7B8F5" },
      ],
      timeToRelief: "Support companion ready immediately",
    },
  };

  const currentData = scenarios[activeScenario];

  const steps = [
    {
      num: '01',
      title: 'Share where you are',
      desc: 'Type as little or as much as you want. Use raw thoughts, single words, or pick from common prompts.',
      icon: MessageSquareHeart,
      tag: 'Zero judgment',
      color: '#F4B6D7',
    },
    {
      num: '02',
      title: 'We map the maze',
      desc: 'Instead of searching across 12 confusing university websites, HERE instantly matches you to exact resources and specialists.',
      icon: Sparkles,
      tag: '12 departments unified',
      color: '#EBA756',
    },
    {
      num: '03',
      title: 'Private warm handoff',
      desc: 'Book confidential 1-on-1 consultations, unlock emergency relief grants, or chat with verified student counsellors.',
      icon: CalendarClock,
      tag: '100% confidential',
      color: '#8DCFA9',
    },
    {
      num: '04',
      title: 'Gentle follow-through',
      desc: 'You won’t get lost in the system. Your personal timeline tracks every request, appointment, and grant until you feel stable.',
      icon: HeartHandshake,
      tag: 'Never alone',
      color: '#C7B8F5',
    },
  ];

  return (
    <section 
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0F0F14',
        overflow: 'hidden',
      }}
    >
      {/* Warm Ambient Lantern Lighting */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          right: '8%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 167, 86, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 182, 215, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '4.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(235, 167, 86, 0.12)',
              color: '#F5BE7B',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={15} />
            <span>A calm front door for student life</span>
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
            From silent panic to <span style={{ color: '#F4B6D7', fontStyle: 'italic' }}>genuine relief</span> in four gentle steps.
          </h2>

          <p 
            style={{
              fontSize: 'clamp(15px, 1.15vw, 17px)',
              lineHeight: 1.65,
              color: '#B8B3AA',
              maxWidth: '640px',
            }}
          >
            University systems are notoriously fragmented. When you’re stressed or overwhelmed, you shouldn’t have to guess which office to email. We take care of the navigation for you.
          </p>
        </div>

        {/* 2-Column Editorial Grid: Left Steps + Right Interactive Experience Simulator */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: 4 Empathetic Pathway Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div 
                  key={step.num}
                  className="glass-panel"
                  style={{
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    background: 'rgba(24, 23, 32, 0.65)',
                    borderRadius: '20px',
                    transition: 'all 250ms ease',
                  }}
                >
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: `rgba(${step.num === '01' ? '244, 182, 215' : step.num === '02' ? '235, 167, 86' : step.num === '03' ? '141, 207, 169' : '199, 184, 245'}, 0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={22} color={step.color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: step.color, letterSpacing: '0.08em' }}>
                        {step.num}
                      </span>
                      <span style={{ fontSize: '11px', color: '#78746C' }}>•</span>
                      <span style={{ fontSize: '11.5px', color: '#B8B3AA', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                        {step.tag}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#FAF8F5', marginBottom: '6px' }}>
                      {step.title}
                    </h3>
                    
                    <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#B8B3AA' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Sanctuary Simulator */}
          <div 
            className="glass-panel"
            style={{
              padding: '32px 30px',
              borderRadius: '24px',
              background: 'linear-gradient(160deg, rgba(28, 27, 38, 0.85) 0%, rgba(18, 17, 24, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div>
              {/* Simulator Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8DCFA9', boxShadow: '0 0 10px #8DCFA9' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#FAF8F5', letterSpacing: '0.04em' }}>
                    LIVE RELIEF PREVIEW
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#EBA756', background: 'rgba(235, 167, 86, 0.1)', padding: '3px 10px', borderRadius: '9999px' }}>
                  {currentData.timeToRelief}
                </span>
              </div>

              {/* Scenario Toggles */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '12px', color: '#78746C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select a common student situation:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(scenarios).map(([key, sc]) => (
                    <button
                      key={key}
                      onClick={() => setActiveScenario(key)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        fontWeight: activeScenario === key ? 600 : 400,
                        background: activeScenario === key ? 'rgba(244, 182, 215, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                        color: activeScenario === key ? '#F4B6D7' : '#B8B3AA',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* What the student shares */}
              <div 
                style={{
                  background: 'rgba(14, 14, 19, 0.7)',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  marginBottom: '1.5rem',
                  borderLeft: '3px solid #F4B6D7',
                }}
              >
                <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  What you share in private:
                </div>
                <p style={{ fontSize: '14px', color: '#FAF8F5', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{currentData.prompt}"
                </p>
              </div>

              {/* Immediate tailored action plan */}
              <div>
                <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  How HERE coordinates support within minutes:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentData.resolution.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <CheckCircle2 size={18} color={item.color} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '2px' }}>
                          {item.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Sanctuary CTA */}
            <div 
              style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#78746C' }}>
                <Lock size={14} color="#8DCFA9" />
                <span>Zero records sent to faculty</span>
              </div>

              <button
                onClick={() => onNavigate('/chat')}
                className="btn-warm"
                style={{
                  fontSize: '13px',
                  padding: '9px 18px',
                }}
              >
                <span>Try this privately</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
