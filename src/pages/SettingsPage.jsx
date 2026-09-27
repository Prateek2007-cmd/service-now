import React, { useState } from 'react';
import { Shield, Eye, Trash2, CheckCircle, Lock, RefreshCw, Key } from 'lucide-react';

export default function SettingsPage({ onNavigate }) {
  const [historySaved, setHistorySaved] = useState(true);
  const [anonymizedStats, setAnonymizedStats] = useState(false);
  const [sessionAutoPurge, setSessionAutoPurge] = useState(true);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  const handleDeleteHistory = () => {
    if (confirm("Are you sure you want to permanently purge all conversation history and temporary signals from this browser?")) {
      setDeletedSuccess(true);
      setTimeout(() => setDeletedSuccess(false), 3000);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#05080F', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3rem)' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
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
              marginBottom: '1rem',
            }}
          >
            <Shield size={14} />
            <span>Privacy Architecture</span>
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
            Privacy & settings
          </h1>
          <p style={{ fontSize: '16px', color: '#9BA4B5' }}>
            Zero third-party trackers. You hold cryptographic control over your support signals.
          </p>
        </div>

        {deletedSuccess && (
          <div 
            style={{
              background: 'rgba(20, 48, 36, 0.7)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '12px',
              padding: '12px 18px',
              color: '#86efac',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '2rem',
            }}
          >
            <CheckCircle size={16} />
            <span>All local session signals and history successfully purged.</span>
          </div>
        )}

        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: What HERE Stores */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F4F2', marginBottom: '8px' }}>
              What HERE stores
            </h3>
            <p style={{ fontSize: '14px', color: '#9BA4B5', lineHeight: 1.6, marginBottom: '14px' }}>
              Only verified appointment records, confirmed support routing tags, and student-consented case files sent to human practitioners.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', background: 'rgba(8,14,24,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#F5F4F2', fontWeight: 500 }}>Retain Chat Intake History Locally</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>Allows resuming ongoing conversations on this device</div>
              </div>
              <input 
                type="checkbox" 
                checked={historySaved} 
                onChange={(e) => setHistorySaved(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#F4B6D7', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Section 2: What HERE Uses */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.75rem' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F4F2', marginBottom: '8px' }}>
              What HERE uses
            </h3>
            <p style={{ fontSize: '14px', color: '#9BA4B5', lineHeight: 1.6, marginBottom: '14px' }}>
              Natural language models run locally or in private university sovereign instances to classify intent and urgency. No commercial model training.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', background: 'rgba(8,14,24,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#F5F4F2', fontWeight: 500 }}>Campus Pulse Aggregate Research</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>Contribute anonymized trend data (e.g., campus-wide exam stress spikes)</div>
              </div>
              <input 
                type="checkbox" 
                checked={anonymizedStats} 
                onChange={(e) => setAnonymizedStats(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#8EDCF2', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Section 3: What You Control */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.75rem' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F4F2', marginBottom: '8px' }}>
              What you control
            </h3>
            <p style={{ fontSize: '14px', color: '#9BA4B5', lineHeight: 1.6, marginBottom: '16px' }}>
              You may purge your active conversation record or reset all personalized routing state at any time.
            </p>
            <button
              onClick={handleDeleteHistory}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <Trash2 size={16} />
              <span>Purge Local History & Reset Signals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
