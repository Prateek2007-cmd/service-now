import React, { useState } from 'react';
import { User, Shield, Bell, Globe, Lock, Key, Sliders, CheckCircle2 } from 'lucide-react';

export default function ProfilePage({ onNavigate }) {
  const [saved, setSaved] = useState(false);
  const [preferredName, setPreferredName] = useState('Alex Rivers');
  const [studentId, setStudentId] = useState('STU-882910');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [notificationType, setNotificationType] = useState('Confidential SMS');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
              color: '#8EDCF2',
              marginBottom: '1rem',
            }}
          >
            <User size={14} />
            <span>Account</span>
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
            Your profile
          </h1>
          <p style={{ fontSize: '16px', color: '#9BA4B5' }}>
            Your data, your control. Manage your preferences and support identity.
          </p>
        </div>

        {saved && (
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
            <CheckCircle2 size={16} />
            <span>Profile settings updated securely.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
          {/* Section: Personal Details */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F4F2', marginBottom: '1.25rem' }}>
              Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9BA4B5', marginBottom: '6px' }}>Preferred Name</label>
                <input 
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(8, 14, 24, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#F5F4F2',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9BA4B5', marginBottom: '6px' }}>Student Identifier</label>
                <input 
                  type="text"
                  value={studentId}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(8, 14, 24, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#64748B',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section: Preferences */}
          <div style={{ marginBottom: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F4F2', marginBottom: '1.25rem' }}>
              Support Preferences
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9BA4B5', marginBottom: '6px' }}>Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(8, 14, 24, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#F5F4F2',
                    fontSize: '14px',
                  }}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="Mandarin">Mandarin (Simplified)</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9BA4B5', marginBottom: '6px' }}>Appointment Reminders</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(8, 14, 24, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#F5F4F2',
                    fontSize: '14px',
                  }}
                >
                  <option value="Confidential SMS">Confidential SMS</option>
                  <option value="In-Portal Anonymous Notification">In-Portal Anonymous Notification</option>
                  <option value="University Email (Discrete header)">University Email (Discrete header)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Privacy Guarantee */}
          <div 
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              background: 'rgba(15, 25, 40, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '2rem',
            }}
          >
            <Lock size={20} color="#8EDCF2" />
            <div style={{ fontSize: '13px', color: '#CBD5E1' }}>
              All interactions on HERE are bound by FERPA and strict university health confidentiality standards.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => onNavigate('/settings')}
              className="btn-secondary"
            >
              Advanced Privacy Controls
            </button>
            <button 
              type="submit"
              className="btn-primary"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
