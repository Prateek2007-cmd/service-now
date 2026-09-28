import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Heart, ArrowRight, Bell, KeyRound, ExternalLink } from 'lucide-react';
import QuietBuddyInvite from '../components/QuietBuddyInvite';
import { BuddyPrivacyPreview } from '../components/QuietBuddyTracker';
import { getStore, getCurrentCase, subscribeStore } from '../services/store';
import { getCurrentUser } from '../services/authService';

export default function QuietBuddyPage({ onNavigate }) {
  const [currentCase, setCurrentCase] = useState(() => getCurrentCase());
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
    return subscribeStore(() => setCurrentCase(getCurrentCase()));
  }, []);

  const studentName = currentCase?.studentName || user?.name || '';
  const appointment = currentCase?.appointment || null;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#0B0B0E', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3rem)' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(199, 184, 245, 0.12)',
              color: '#C7B8F5',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '1.25rem',
            }}
          >
            <Users size={15} />
            <span>Quiet Buddy</span>
          </div>

          <h1 className="font-editorial" style={{ fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1.12, color: '#FAF8F5', marginBottom: '1rem' }}>
            You don't have to be the <br />
            <span style={{ color: '#C7B8F5', fontStyle: 'italic' }}>only one who knows.</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 1.2vw, 17px)', lineHeight: 1.65, color: '#B8B3AA', maxWidth: '660px' }}>
            Nominate one person — a friend, a partner, a flatmate — to walk alongside you. You get a one-time code
            to share with them. They create their own account, get reminders before your appointments, and see a
            simple view of how things are going.
          </p>
        </div>

        {/* Why it helps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {[
            { icon: Heart, color: '#F4B6D7', title: 'Presence counts', body: 'The evidence on mental-health support is blunt: a person who simply shows up is often the single biggest protective factor.' },
            { icon: KeyRound, color: '#EBA756', title: 'No phone number needed', body: 'Share a code however you like — message, email, or just show them. They make their own account in a minute.' },
            { icon: ShieldCheck, color: '#8DCFA9', title: 'Nothing sensitive shared', body: 'No symptoms, no department, no case number, no notes. Their account cannot reach any other part of the site.' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="glass-panel" style={{ borderRadius: '20px', padding: '24px 22px' }}>
                <Icon size={21} color={card.color} style={{ marginBottom: '12px' }} />
                <h2 style={{ fontSize: '15.5px', fontWeight: 600, color: '#FAF8F5', marginBottom: '7px' }}>{card.title}</h2>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#B8B3AA' }}>{card.body}</p>
              </div>
            );
          })}
        </div>

        {/* The invite itself */}
        <QuietBuddyInvite studentName={studentName} caseId={currentCase?.id || null} appointment={appointment} />

        {/* Privacy preview, once a code exists */}
        <BuddyPrivacyPreview caseObj={currentCase} studentName={studentName} onNavigate={onNavigate} />

        {/* How the handoff actually works */}
        <div
          className="glass-panel"
          style={{ borderRadius: '20px', padding: 'clamp(24px, 4vw, 30px)', marginTop: '2.5rem' }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#C7B8F5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '18px' }}>
            How it works
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { n: '01', title: 'You create a code', body: 'One code, one use. Share it however is easiest — text, email, or in person.' },
              { n: '02', title: 'They join in a minute', body: 'They open the buddy portal, enter the code, and make their own account. No forms for you.' },
              { n: '03', title: 'They see only milestones', body: 'Four steps, an appointment time, and reminders. Nothing about what you told us.' },
            ].map((step) => (
              <div key={step.n}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#C7B8F5', letterSpacing: '0.08em', marginBottom: '7px' }}>{step.n}</div>
                <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5', marginBottom: '6px' }}>{step.title}</div>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#B8B3AA' }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '2rem', alignItems: 'center' }}>
          <button onClick={() => onNavigate('/chat')} className="btn-primary" style={{ fontSize: '14px', padding: '12px 24px' }}>
            <span>Start or continue a request</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={() => onNavigate('/journey')} className="btn-secondary" style={{ fontSize: '14px', padding: '12px 22px' }}>
            <span>Go to My Journey</span>
          </button>
          <a
            href="/buddy-portal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '13px',
              color: '#78746C',
              textDecoration: 'none',
              padding: '12px 4px',
            }}
          >
            <span>Are you the buddy? Open the portal</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
