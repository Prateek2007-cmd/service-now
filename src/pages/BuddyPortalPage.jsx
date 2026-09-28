import React, { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  EyeOff,
  Check,
  LogOut,
  Calendar,
  Bell,
  ArrowRight,
  Heart,
  Lock,
  Info,
} from 'lucide-react';
import {
  createBuddyAccount,
  signInBuddy,
  signOutBuddy,
  getBuddyPortalData,
  getCurrentBuddy,
  subscribeBuddyAccounts,
  markBuddyRemindersRead,
  queueBuddyReminder,
  PORTAL_MILESTONES,
} from '../services/buddyAccountService';

export default function BuddyPortalPage({ onNavigate }) {
  const [buddy, setBuddy] = useState(() => getCurrentBuddy());
  const [mode, setMode] = useState('redeem');
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      subscribeBuddyAccounts(() => {
        setBuddy(getCurrentBuddy());
      }),
    []
  );

  const data = getBuddyPortalData();

  // Mark reminders read once the buddy opens the portal.
  useEffect(() => {
    if (buddy) markBuddyRemindersRead();
  }, [buddy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    setTimeout(() => {
      const result =
        mode === 'redeem'
          ? createBuddyAccount(form)
          : signInBuddy({ email: form.email, password: form.password });
      setBusy(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setForm({ name: '', email: '', password: '', code: '' });
    }, 500);
  };

  // ------------------------------------------------------------ signed in
  if (buddy && data) {
    const currentIndex = Math.max(
      0,
      PORTAL_MILESTONES.findIndex((m) => m.label === data.milestone?.label)
    );

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B0B0E', padding: 'clamp(2rem, 6vw, 4rem) 1.5rem' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div
            style={{
              background: '#0F0F14',
              borderRadius: '26px',
              padding: 'clamp(28px, 5vw, 40px)',
              border: '1px solid rgba(199, 184, 245, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '22px' }}>
              <Users size={17} color="#C7B8F5" />
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#C7B8F5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quiet Buddy
              </span>
            </div>

            <h1 className="font-editorial" style={{ fontSize: '30px', color: '#FAF8F5', lineHeight: 1.25, marginBottom: '10px' }}>
              Thanks for being there, {data.buddyName.split(' ')[0]}.
            </h1>
            <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: '#B8B3AA', marginBottom: '28px' }}>
              You're helping {data.studentFirstName}. That matters more than anything you could say.
            </p>

            {/* Appointment */}
            {data.appointment ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '13px',
                  padding: '16px 18px',
                  borderRadius: '16px',
                  background: 'rgba(235, 167, 86, 0.1)',
                  border: '1px solid rgba(235, 167, 86, 0.25)',
                  marginBottom: '28px',
                }}
              >
                <Calendar size={19} color="#EBA756" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5' }}>
                    {data.appointment.date} at {data.appointment.time}
                  </div>
                  <div style={{ fontSize: '13px', color: '#B8B3AA', marginTop: '2px' }}>{data.appointment.location}</div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '15px 17px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  marginBottom: '28px',
                  fontSize: '13.5px',
                  color: '#B8B3AA',
                }}
              >
                <Calendar size={16} color="#78746C" style={{ flexShrink: 0 }} />
                <span>Nothing booked yet. You'll get a notification when there is.</span>
              </div>
            )}

            {/* Milestones */}
            <div style={{ fontSize: '11.5px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>
              Progress
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '28px' }}>
              {PORTAL_MILESTONES.map((m, i) => {
                const isDone = i < currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isCurrent ? '#EBA756' : isDone ? '#8DCFA9' : '#1E1D26',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDone || isCurrent ? '#0B0B0E' : '#78746C',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {isDone ? <Check size={13} strokeWidth={3} /> : i + 1}
                      </div>
                      {i < PORTAL_MILESTONES.length - 1 && (
                        <div style={{ width: '2px', height: '26px', background: isDone ? '#8DCFA9' : 'rgba(255,255,255,0.08)' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: '10px' }}>
                      <div style={{ fontSize: '14px', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? '#EBA756' : isDone ? '#FAF8F5' : '#78746C' }}>
                        {m.label}
                      </div>
                      {isCurrent && <div style={{ fontSize: '12.5px', color: '#B8B3AA', marginTop: '2px' }}>Where things are now</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reminders */}
            {data.reminders.length > 0 && (
              <>
                <div style={{ fontSize: '11.5px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
                  Reminders
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '28px' }}>
                  {data.reminders.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '13px 15px',
                        borderRadius: '13px',
                        background: 'rgba(0,0,0,0.28)',
                        fontSize: '13px',
                        lineHeight: 1.55,
                        color: '#B8B3AA',
                      }}
                    >
                      <Bell size={14} color="#8EDCF2" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{r.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Redaction promise */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '11px',
                padding: '15px 17px',
                borderRadius: '14px',
                background: 'rgba(141, 207, 169, 0.08)',
                border: '1px solid rgba(141, 207, 169, 0.2)',
                marginBottom: '22px',
              }}
            >
              <ShieldCheck size={16} color="#8DCFA9" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#8DCFA9', marginBottom: '4px' }}>
                  This is all you can see
                </div>
                <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#B8B3AA' }}>
                  {data.studentFirstName} hasn't shared what they're going through, and you won't be told. Your account
                  cannot see any of their case details. If they want to talk, they'll tell you.
                </p>
              </div>
            </div>

            <button onClick={() => signOutBuddy()} className="btn-secondary" style={{ fontSize: '13px', padding: '10px 20px' }}>
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ sign up / in
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0B0E', padding: 'clamp(2rem, 6vw, 4rem) 1.5rem', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '470px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'rgba(199, 184, 245, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <Users size={25} color="#C7B8F5" />
          </div>
          <h1 className="font-editorial" style={{ fontSize: '30px', color: '#FAF8F5', marginBottom: '10px' }}>
            You've been asked to be a Quiet Buddy.
          </h1>
          <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: '#B8B3AA' }}>
            Someone you care about has asked for support and wants you alongside them. You'll get reminders before
            their appointments and a simple view of how things are going.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#0F0F14',
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 30px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', marginBottom: '22px' }}>
            {[
              { id: 'redeem', label: 'I have a code' },
              { id: 'signin', label: 'Sign in' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: mode === tab.id ? 600 : 400,
                  background: mode === tab.id ? 'rgba(199,184,245,0.18)' : 'transparent',
                  color: mode === tab.id ? '#C7B8F5' : '#B8B3AA',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === 'redeem' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#B8B3AA', display: 'block', marginBottom: '7px' }}>Invitation code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="ABC-123"
                style={inputStyle}
              />
            </div>
          )}

          {mode === 'redeem' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#B8B3AA', display: 'block', marginBottom: '7px' }}>Your name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Sam Ahmed"
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#B8B3AA', display: 'block', marginBottom: '7px' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', color: '#B8B3AA', display: 'block', marginBottom: '7px' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder={mode === 'redeem' ? 'At least 8 characters' : 'Your password'}
              autoComplete={mode === 'redeem' ? 'new-password' : 'current-password'}
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(252, 165, 165, 0.1)',
                border: '1px solid rgba(252, 165, 165, 0.3)',
                color: '#FCA5A5',
                fontSize: '12.5px',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '13px 24px', opacity: busy ? 0.6 : 1 }}
          >
            {busy ? 'Just a moment...' : mode === 'redeem' ? 'Join as a Quiet Buddy' : 'Sign in'}
            {!busy && <ArrowRight size={16} />}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '13px 15px',
              borderRadius: '12px',
              background: 'rgba(141, 207, 169, 0.07)',
              border: '1px solid rgba(141, 207, 169, 0.18)',
              marginTop: '18px',
            }}
          >
            <EyeOff size={14} color="#8DCFA9" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#B8B3AA' }}>
              You will <strong style={{ color: '#8DCFA9' }}>never</strong> see what they told the wellbeing team,
              which department they're with, or any session notes. Your account is completely separate from theirs.
            </p>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          <button
            onClick={() => onNavigate('/')}
            style={{ background: 'none', border: 'none', color: '#78746C', cursor: 'pointer', fontSize: '13px' }}
          >
            ← Back to HERE
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  color: '#FAF8F5',
  fontSize: '14px',
  outline: 'none',
};
