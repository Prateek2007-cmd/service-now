import React from 'react';
import { ShieldCheck, Lock, FileCheck, EyeOff, Server, ArrowRight } from 'lucide-react';

export default function PrivacyPage({ onNavigate }) {
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
            <ShieldCheck size={14} />
            <span>Confidentiality & Compliance</span>
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
            Privacy by architecture.
          </h1>
          <p style={{ fontSize: '16px', color: '#9BA4B5' }}>
            Tangible guarantees, not marketing slogans. What we collect, how it’s protected, and why you stay in control.
          </p>
        </div>

        {/* 3 Pillared Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Lock size={22} color="#F4B6D7" />
              <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#F5F4F2' }}>1. Sovereign University Data Storage</h3>
            </div>
            <p style={{ fontSize: '14.5px', color: '#CBD5E1', lineHeight: 1.65 }}>
              All cases and appointment records are housed within institutional ServiceNow secure encrypted database schemas. No personal intake transcript is ever sent to or indexed by public AI models.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <EyeOff size={22} color="#8EDCF2" />
              <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#F5F4F2' }}>2. Student-Consented Handoff</h3>
            </div>
            <p style={{ fontSize: '14.5px', color: '#CBD5E1', lineHeight: 1.65 }}>
              When connecting with a human counsellor, an AI-generated synthesis is prepared so you do not need to repeat your trauma. However, this summary is only dispatched once you review and click 'Authorize'.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FileCheck size={22} color="#D9A66B" />
              <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#F5F4F2' }}>3. FERPA & HIPAA Grade Compliance</h3>
            </div>
            <p style={{ fontSize: '14.5px', color: '#CBD5E1', lineHeight: 1.65 }}>
              All communications adhere to the Family Educational Rights and Privacy Act (FERPA) alongside healthcare privacy requirements.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => onNavigate('/settings')} className="btn-secondary" style={{ padding: '12px 24px' }}>
            Manage Your Privacy Controls →
          </button>
        </div>
      </div>
    </div>
  );
}
