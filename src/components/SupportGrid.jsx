import React, { useState } from 'react';
import { 
  BookOpen, 
  Heart, 
  Coins, 
  Users, 
  Home, 
  Accessibility, 
  ArrowRight,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  X,
  ShieldCheck,
  Check,
  PhoneCall
} from 'lucide-react';

export default function SupportGrid({ onNavigate, onSelectDepartment }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDept, setSelectedDept] = useState(null);
  const [highlightedDeptId, setHighlightedDeptId] = useState(null);

  const categories = [
    { id: 'all', label: 'All Departments' },
    { id: 'wellbeing', label: 'Mental Wellbeing' },
    { id: 'academic', label: 'Academic & Exams' },
    { id: 'financial', label: 'Emergency Aid & Grants' },
    { id: 'living', label: 'Housing & Community' },
    { id: 'accessibility', label: 'Accessibility' },
  ];

  const quickFeelings = [
    { text: "“I’m panicking about my midterms”", deptId: 'academic' },
    { text: "“I can’t afford groceries this week”", deptId: 'financial' },
    { text: "“I feel overwhelmed and can’t sleep”", deptId: 'counselling' },
    { text: "“My landlord is threatening eviction”", deptId: 'housing' },
    { text: "“I need chronic illness test accommodations”", deptId: 'accessibility' },
  ];

  const departments = [
    {
      id: 'counselling',
      category: 'wellbeing',
      title: 'Counseling & Mental Wellbeing',
      tagline: 'Private 1-on-1 therapy, anxiety mitigation, 24/7 crisis support.',
      details: 'Confidential consultations with licensed psychotherapists and clinical wellbeing officers. Whether you are dealing with imposter syndrome, panic attacks, depression, or acute academic distress, sessions are free and confidential.',
      advisor: 'Dr. Sarah Jenkins, Clinical Wellbeing Lead',
      advisorQuote: '“You don’t need to be in severe crisis to reach out. Reaching out early is a sign of strength.”',
      icon: Heart,
      accentColor: '#F4B6D7',
      bgGlow: 'radial-gradient(circle at 85% 15%, rgba(244, 182, 215, 0.12) 0%, transparent 65%)',
      waitEstimate: 'First consultation within 24–48 hours',
      availability: 'Mon–Fri 8am–8pm • 24/7 crisis hotline',
      confidentialityPledge: 'Zero notes accessible to professors or employers.',
      route: '/counselling',
    },
    {
      id: 'academic',
      category: 'academic',
      title: 'Academic Strategy & Tutoring',
      tagline: 'Exam de-escalation, peer tutoring, official deadline extensions.',
      details: 'Tailored study coaching from 4th-year high-achievers and writing faculty. We draft official mitigating circumstances petitions, build realistic revision timetables, and eliminate exam paralysis.',
      advisor: 'Prof. David Vance, Academic Director',
      advisorQuote: '“Falling behind is common and reversible. We break the syllabus down until it is manageable again.”',
      icon: BookOpen,
      accentColor: '#EBA756',
      bgGlow: 'radial-gradient(circle at 85% 15%, rgba(235, 167, 86, 0.12) 0%, transparent 65%)',
      waitEstimate: 'Same-day tutor matching',
      availability: 'Daily 9am–9pm in Library & Online',
      confidentialityPledge: 'Advising notes are kept separate from faculty grading.',
      route: '/support',
    },
    {
      id: 'financial',
      category: 'financial',
      title: 'Emergency Aid & Student Grants',
      tagline: 'Direct bursaries, food stipends, tuition payment rescheduling.',
      details: 'Emergency cash grants for unexpected hardship, textbook subsidies, semester payment pauses, and campus pantry discreet digital tokens with zero credit inquiries.',
      advisor: 'Maria Gonzalez, Student Financial Advocate',
      advisorQuote: '“Financial stress shouldn’t force you out of your education. Discretionary emergency funds exist for you.”',
      icon: Coins,
      accentColor: '#8DCFA9',
      bgGlow: 'radial-gradient(circle at 85% 15%, rgba(141, 207, 169, 0.12) 0%, transparent 65%)',
      waitEstimate: 'Emergency cash disbursed within 24–48 hrs',
      availability: 'Mon–Fri 9am–5pm',
      confidentialityPledge: 'Applications are blind-reviewed by the welfare committee.',
      route: '/support',
    },
    {
      id: 'housing',
      category: 'living',
      title: 'Housing, Tenancy & International',
      tagline: 'Emergency accommodation, visa renewals, tenancy disputes.',
      details: 'Immediate emergency dormitory beds, legal lease contract review for predatory landlords, and specialized international student visa compliance advisory.',
      advisor: 'Kofi Mensah, Global Student Liaison',
      advisorQuote: '“Moving countries or fighting a landlord can be terrifying alone. We stand beside you every step.”',
      icon: Home,
      accentColor: '#C7B8F5',
      bgGlow: 'radial-gradient(circle at 85% 15%, rgba(199, 184, 245, 0.12) 0%, transparent 65%)',
      waitEstimate: 'Instant assistance for housing crises',
      availability: '24/7 emergency dispatch',
      confidentialityPledge: 'We protect international student residency privacy.',
      route: '/support',
    },
    {
      id: 'accessibility',
      category: 'accessibility',
      title: 'Accessibility & Neurodiversity',
      tagline: 'Exam accommodations, quiet spaces, assistive tech provisioning.',
      details: 'Support for ADHD, autism, dyslexia, chronic illness, and mobility challenges. We coordinate formal extra-time provisions, assistive software licenses, and private exam rooms.',
      advisor: 'Clara Oswald, Lead Accessibility Officer',
      advisorQuote: '“Education is meant to be accessible. We ensure you have the precise adjustments you deserve.”',
      icon: Accessibility,
      accentColor: '#F5BE7B',
      bgGlow: 'radial-gradient(circle at 85% 15%, rgba(245, 190, 123, 0.12) 0%, transparent 65%)',
      waitEstimate: 'Fast-track semester accommodations',
      availability: 'Mon–Fri 8:30am–5:30pm',
      confidentialityPledge: 'Medical diagnostic files are locked and HIPAA-protected.',
      route: '/support',
    },
    {
      id: 'affairs',
      category: 'living',
      title: 'Student Advocacy & Mediation',
      tagline: 'Formal faculty complaints, dispute resolution, union rights.',
      details: 'Independent student ombudsman representation for grading appeals, university disciplinary mediation, harassment reporting, and anonymous conflict escalation.',
      advisor: 'Liam Becker, Independent Ombudsperson',
      advisorQuote: '“We represent you — not university management. Your rights and well-being come first.”',
      icon: Users,
      accentColor: '#F4B6D7',
      bgGlow: 'radial-gradient(circle at 85% 15%, rgba(244, 182, 215, 0.12) 0%, transparent 65%)',
      waitEstimate: 'Direct advocate assigned in 24 hours',
      availability: 'Mon–Fri 9am–6pm',
      confidentialityPledge: 'Independent of university faculty boards.',
      route: '/support',
    },
  ];

  const filteredDepts = activeCategory === 'all'
    ? departments
    : departments.filter(d => d.category === activeCategory);

  const handleQuickFeel = (deptId) => {
    setHighlightedDeptId(deptId);
    setActiveCategory('all');
    const target = departments.find(d => d.id === deptId);
    if (target) {
      setSelectedDept(target);
    }
  };

  return (
    <section 
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0B0B0E',
        overflow: 'hidden',
      }}
    >
      {/* Warm Ambient Backlight */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(235, 167, 86, 0.05) 0%, transparent 70%)',
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
              background: 'rgba(244, 182, 215, 0.12)',
              color: '#F4B6D7',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={15} />
            <span>Comprehensive Student Sanctuary</span>
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
            Six specialized departments. <br />
            <span style={{ color: '#EBA756', fontStyle: 'italic' }}>One calm, confidential</span> front door.
          </h2>

          <p 
            style={{
              fontSize: 'clamp(15px, 1.15vw, 17px)',
              lineHeight: 1.65,
              color: '#B8B3AA',
            }}
          >
            No gatekeeping, no repeated explanations, and no confusing department acronyms. Click any service to book directly or explore what’s covered.
          </p>
        </div>

        {/* Intuitive "I don't know who to ask" Quick Finder */}
        <div 
          style={{
            background: 'rgba(24, 23, 32, 0.7)',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#EBA756', fontWeight: 600 }}>
            <span>Unsure where to begin? Tap what you’re feeling right now:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {quickFeelings.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickFeel(q.deptId)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  outline: 'none',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  color: '#FAF8F5',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '2.5rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: activeCategory === cat.id ? 600 : 400,
                background: activeCategory === cat.id ? '#FAF8F5' : 'rgba(255, 255, 255, 0.04)',
                color: activeCategory === cat.id ? '#0B0B0E' : '#B8B3AA',
                transition: 'all 200ms ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 6 Rich Department Cards */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredDepts.map((dept) => {
            const IconComp = dept.icon;
            const isHighlighted = highlightedDeptId === dept.id;

            return (
              <div 
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '32px 28px',
                  borderRadius: '24px',
                  background: `linear-gradient(170deg, rgba(26, 25, 36, 0.8) 0%, rgba(18, 17, 24, 0.95) 100%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  borderColor: isHighlighted ? 'rgba(235, 167, 86, 0.5)' : 'rgba(255, 255, 255, 0.06)',
                  boxShadow: isHighlighted ? '0 0 30px rgba(235, 167, 86, 0.2)' : '0 10px 36px rgba(0,0,0,0.4)',
                }}
              >
                {/* Background soft accent illumination */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: dept.bgGlow,
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  {/* Top Icon & Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div 
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={24} color={dept.accentColor} />
                    </div>

                    <span 
                      style={{
                        fontSize: '12px',
                        color: dept.accentColor,
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontWeight: 500,
                      }}
                    >
                      {dept.waitEstimate}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FAF8F5', marginBottom: '8px' }}>
                    {dept.title}
                  </h3>

                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#B8B3AA', marginBottom: '1.5rem' }}>
                    {dept.tagline}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div 
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#78746C' }}>
                    <ShieldCheck size={14} color="#8DCFA9" />
                    <span>Free & Confidential</span>
                  </div>

                  <span 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: dept.accentColor,
                    }}
                  >
                    <span>Explore</span>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sanctuary Detail Modal */}
      {selectedDept && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedDept(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '680px',
              width: '100%',
              background: '#16151E',
              borderRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              padding: 'clamp(24px, 4vw, 36px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <span 
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: selectedDept.accentColor,
                  }}
                >
                  {selectedDept.availability}
                </span>
                <h3 className="font-editorial" style={{ fontSize: '28px', color: '#FAF8F5', marginTop: '4px' }}>
                  {selectedDept.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B8B3AA',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Department Details Description */}
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#FAF8F5', marginBottom: '1.75rem' }}>
              {selectedDept.details}
            </p>

            {/* Advisor Human Quote */}
            <div 
              style={{
                background: 'rgba(235, 167, 86, 0.08)',
                borderLeft: '3px solid #EBA756',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '1.75rem',
              }}
            >
              <p style={{ fontSize: '13.5px', color: '#FAF8F5', fontStyle: 'italic', marginBottom: '6px' }}>
                {selectedDept.advisorQuote}
              </p>
              <div style={{ fontSize: '12px', color: '#EBA756', fontWeight: 600 }}>
                {selectedDept.advisor}
              </div>
            </div>

            {/* Key Service Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase' }}>Turnaround</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5', marginTop: '2px' }}>{selectedDept.waitEstimate}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase' }}>Privacy Pledge</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#8DCFA9', marginTop: '2px' }}>{selectedDept.confidentialityPledge}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setSelectedDept(null);
                  if (onSelectDepartment) onSelectDepartment(selectedDept.title);
                  else onNavigate('/chat');
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span>Start Private Consultation</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setSelectedDept(null);
                  onNavigate('/appointments');
                }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Calendar size={16} />
                <span>Book 1-on-1 Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
