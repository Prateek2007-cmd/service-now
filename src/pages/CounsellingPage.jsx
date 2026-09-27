import React, { useState } from 'react';
import { Heart, Calendar, Clock, Star, Shield, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';
import { AssistantOrb } from '../components/AssistantOrb';

export default function CounsellingPage({ onNavigate }) {
  const [bookedCounsellor, setBookedCounsellor] = useState(null);

  const counsellors = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      role: "Senior Wellbeing Clinical Lead",
      specialties: ["Exam Anxiety", "Cognitive Behavioral Reset", "Burnout"],
      availability: "Tomorrow, 11:00 AM",
      duration: "50 min",
      rating: "4.9",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      name: "Marcus Thorne, MSW",
      role: "Licensed Student Counsellor",
      specialties: ["Transition & Isolation", "Depression", "Academic Overwhelm"],
      availability: "Thursday, 2:30 PM",
      duration: "50 min",
      rating: "4.9",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      name: "Dr. Priya Nair",
      role: "Cross-Cultural Wellbeing Specialist",
      specialties: ["International Student Life", "Family Pressures", "Mindfulness"],
      availability: "Friday, 10:00 AM",
      duration: "45 min",
      rating: "5.0",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#05080F', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3rem)' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '9999px',
              background: 'rgba(244, 182, 215, 0.12)',
              border: '1px solid rgba(244, 182, 215, 0.3)',
              fontSize: '12.5px',
              color: '#F4B6D7',
              marginBottom: '1rem',
            }}
          >
            <Heart size={14} />
            <span>Counseling & Wellbeing</span>
          </div>
          <h1 
            style={{
              fontSize: 'clamp(34px, 4vw, 56px)',
              fontWeight: 650,
              color: '#F5F4F2',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Support when you need it.
          </h1>
          <p style={{ fontSize: '16.5px', color: '#9BA4B5', maxWidth: '640px' }}>
            Book confidential sessions with university counsellors. No referral required.
          </p>
        </div>

        {/* Emergency Fast Response Banner */}
        <div 
          className="glass-panel"
          style={{
            padding: '20px 26px',
            borderRadius: '16px',
            background: 'rgba(20, 32, 50, 0.75)',
            border: '1px solid rgba(142, 220, 242, 0.25)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(142, 220, 242, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare size={20} color="#8EDCF2" />
            </div>
            <div>
              <div style={{ fontSize: '15.5px', fontWeight: 600, color: '#F5F4F2' }}>
                Need urgent or same-day support?
              </div>
              <div style={{ fontSize: '13px', color: '#9BA4B5' }}>
                Immediate crisis triage and on-call counselors available 24/7.
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('/chat')}
            className="btn-primary"
            style={{ fontSize: '13.5px', padding: '9px 20px' }}
          >
            Talk to someone now →
          </button>
        </div>

        {/* Counsellors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {counsellors.map((c) => (
            <div 
              key={c.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '28px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <img 
                    src={c.photo} 
                    alt={c.name} 
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F4F2' }}>{c.name}</h3>
                    <div style={{ fontSize: '13px', color: '#8EDCF2' }}>{c.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                  {c.specialties.map((spec) => (
                    <span 
                      key={spec}
                      style={{
                        fontSize: '11.5px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#CBD5E1',
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div 
                  style={{
                    background: 'rgba(8, 14, 24, 0.6)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748B' }}>Next Slot:</span>
                    <span style={{ color: '#F4B6D7', fontWeight: 500 }}>{c.availability}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Duration:</span>
                    <span style={{ color: '#F5F4F2' }}>{c.duration}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setBookedCounsellor(c.name);
                  setTimeout(() => onNavigate('/appointments'), 800);
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {bookedCounsellor === c.name ? 'Slot Reserved!' : 'Book appointment'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
