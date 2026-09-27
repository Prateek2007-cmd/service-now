import React from 'react';
import { ArrowRight, Layers, ShieldCheck, HeartHandshake, Sparkles, Building2 } from 'lucide-react';
import { AssistantOrb } from '../components/AssistantOrb';

export default function AboutPage({ onNavigate }) {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#05080F', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3rem)' }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
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
              color: '#F4B6D7',
              marginBottom: '1.25rem',
            }}
          >
            Our Mission
          </div>
          <h1 
            style={{
              fontSize: 'clamp(34px, 4.5vw, 60px)',
              fontWeight: 650,
              color: '#F5F4F2',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              maxWidth: '820px',
              margin: '0 auto 1.5rem',
            }}
          >
            Support shouldn’t feel like another problem to solve.
          </h1>
          <p style={{ fontSize: '18px', color: '#9BA4B5', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            University support was broken by departmental silos. HERE reconnects care back into a single human experience.
          </p>
        </div>

        {/* 12 -> 1 Convergence Architecture Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '48px clamp(1.5rem, 4vw, 3rem)',
            borderRadius: '24px',
            marginBottom: '4rem',
            textAlign: 'center',
          }}
        >
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Left: 12 Fragmented Departments */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <Building2 size={32} color="#fca5a5" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fca5a5', marginBottom: '8px' }}>12 Siloed Departments</h3>
              <p style={{ fontSize: '13px', color: '#9BA4B5', lineHeight: 1.5 }}>
                Fragmented portals, separate intake queues, redundant paperwork, weeks of waiting.
              </p>
            </div>

            {/* Center: The Shift */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.1em' }}>Convergence</span>
              <div style={{ width: '40px', height: '2px', background: '#F4B6D7' }} />
              <ArrowRight size={24} color="#F4B6D7" />
            </div>

            {/* Right: HERE Unified Entry Point */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(244, 182, 215, 0.08)', border: '1px solid rgba(244, 182, 215, 0.3)' }}>
              <Sparkles size={32} color="#F4B6D7" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F4B6D7', marginBottom: '8px' }}>HERE Calm Entry Point</h3>
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>
                Natural intake, explainable routing, shared context, and active bridge support while waiting.
              </p>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#8EDCF2', marginBottom: '10px' }}>
              Human First. AI Underneath.
            </h3>
            <p style={{ fontSize: '14.5px', color: '#9BA4B5', lineHeight: 1.6 }}>
              Technology should never get in the way of care. The assistant ball quietly organizes signals so human advisors can deliver the most compassionate help.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#F4B6D7', marginBottom: '10px' }}>
              Waiting Is a Supported State
            </h3>
            <p style={{ fontSize: '14.5px', color: '#9BA4B5', lineHeight: 1.6 }}>
              Instead of an empty black box queue, HERE provides curated bridge resources, peer stories, and automatic waitlist swaps when earlier slots open.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#D9A66B', marginBottom: '10px' }}>
              Uncompromising Confidentiality
            </h3>
            <p style={{ fontSize: '14.5px', color: '#9BA4B5', lineHeight: 1.6 }}>
              Zero ad tracking, FERPA adherence, and strict student consent requirements before an AI summary is handed to university personnel.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => onNavigate('/chat')} className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Experience HERE Now →
          </button>
        </div>
      </div>
    </div>
  );
}
