import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Shield, PhoneCall } from 'lucide-react';

export default function HelpPage({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is HERE?",
      a: "HERE is a unified university support platform connecting all 12 campus departments into one calm, private entry point. Instead of navigating confusing administrative directories, you can describe what you are feeling or experiencing, and HERE coordinates the right help.",
    },
    {
      q: "How does HERE understand what I need?",
      a: "HERE uses natural language processing to extract multi-intent signals (such as academic pressure coupled with financial stress) without diagnosing you. It then reflects back what it heard ('AI Mirror') so you are always in control of what pathway is recommended.",
    },
    {
      q: "Who can see my conversations?",
      a: "Your initial intake conversations are completely confidential. When you choose to book an appointment with a counsellor or advisor, HERE generates an anonymized, student-approved summary so you don't have to repeat your story from scratch.",
    },
    {
      q: "Can I change my support pathway?",
      a: "Yes, at any point. On your 'My Journey' dashboard, you can click 'Something Changed' to re-evaluate your needs or choose any alternative department directly from the Support directory.",
    },
    {
      q: "Can I book an appointment through HERE?",
      a: "Yes. HERE coordinates schedules across campus services and offers real-time booking, automated calendar reminders, and intelligent Waitlist Swaps when earlier openings arise.",
    },
    {
      q: "What happens if I need urgent help?",
      a: "Immediate crisis support is accessible 24/7 on every page. You can click 'Talk to someone now' in the Chat or Support view to immediately connect with on-call university crisis professionals.",
    },
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#05080F', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3rem)' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '9999px',
              background: 'rgba(15, 25, 40, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12.5px',
              color: '#8EDCF2',
              marginBottom: '1rem',
            }}
          >
            <HelpCircle size={14} />
            <span>Support & FAQ</span>
          </div>
          <h1 
            style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 650,
              color: '#F5F4F2',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Frequently asked questions
          </h1>
          <p style={{ fontSize: '16px', color: '#9BA4B5' }}>
            Clear answers on how HERE protects your privacy and navigates support.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '3.5rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: '16px',
                  border: isOpen ? '1px solid rgba(244, 182, 215, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? 'rgba(20, 32, 50, 0.7)' : 'transparent',
                    border: 'none',
                    color: '#F5F4F2',
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#F4B6D7" /> : <ChevronDown size={18} color="#9BA4B5" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px', color: '#CBD5E1', fontSize: '14.5px', lineHeight: 1.65 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Assistance Box */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            background: 'rgba(20, 32, 50, 0.65)',
            border: '1px solid rgba(142, 220, 242, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <PhoneCall size={22} color="#8EDCF2" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#F5F4F2' }}>Campus 24/7 Crisis Hotline</div>
              <div style={{ fontSize: '13px', color: '#9BA4B5' }}>Immediate medical or psychological emergencies</div>
            </div>
          </div>
          <a 
            href="tel:988" 
            className="btn-primary" 
            style={{ textDecoration: 'none', fontSize: '13.5px', padding: '9px 20px' }}
          >
            Call Crisis Line (988)
          </a>
        </div>
      </div>
    </div>
  );
}
