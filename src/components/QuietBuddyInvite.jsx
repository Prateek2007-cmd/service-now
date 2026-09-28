import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  EyeOff,
  Check,
  X,
  Copy,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import {
  createInvite,
  revokeInvite,
  peekInvite,
  getRelationshipOptions,
  subscribeBuddyAccounts,
} from '../services/buddyAccountService';

export default function QuietBuddyInvite({ studentName, caseId, appointment = null, onInvited, onRemove, compact = false }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(null);
  const [relationship, setRelationship] = useState('friend');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(
    () =>
      subscribeBuddyAccounts(() => {
        setCode(null);
        setCopied(false);
      }),
    []
  );

  const firstName = String(studentName || 'Someone').trim().split(/\s+/)[0];

  const handleGenerate = (e) => {
    e.preventDefault();
    setError('');
    const result = createInvite({
      studentFirstName: firstName,
      caseId,
      appointment,
      milestone: { label: 'Request received', state: 'current' },
    });
    if (!result?.code) {
      setError('Could not create an invitation. Please try again.');
      return;
    }
    setCode(result.code);
    if (onInvited) onInvited(result);
  };

  const handleCopy = () => {
    if (!code) return;
    const text = `${firstName} invited you to be their Quiet Buddy on the University Wellbeing Hub.\n\nYour code is: ${code}\nOpen /buddy-portal and enter it to get started.`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = () => {
    if (code) revokeInvite(code);
    setCode(null);
    setCopied(false);
    if (onRemove) onRemove();
  };

  const redeemed = code ? peekInvite(code)?.redeemedBy : null;

  // ------------------------------------------------------- code generated
  if (code) {
    return (
      <div
        className="glass-panel"
        style={{
          borderRadius: '20px',
          padding: compact ? '20px 22px' : '24px 26px',
          background: 'rgba(199, 184, 245, 0.07)',
          border: '1px solid rgba(199, 184, 245, 0.28)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(199, 184, 245, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {redeemed ? <CheckCircle2 size={19} color="#8DCFA9" /> : <KeyRound size={19} color="#C7B8F5" />}
            </div>
            <div>
              <div style={{ fontSize: '15.5px', fontWeight: 600, color: '#FAF8F5' }}>
                {redeemed ? 'Your buddy has joined' : 'Invitation code created'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#78746C', marginTop: '2px' }}>
                {redeemed ? 'They now see the redacted tracker' : 'Share this with them however you like'}
              </div>
            </div>
          </div>
          <button
            onClick={handleRevoke}
            style={{ background: 'none', border: 'none', color: '#78746C', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
            aria-label="Revoke invitation"
            title="Revoke invitation"
          >
            <X size={16} />
          </button>
        </div>

        {/* The code */}
        <div
          style={{
            textAlign: 'center',
            padding: '26px 20px',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.32)',
            marginBottom: '16px',
            letterSpacing: '0.22em',
            fontSize: '30px',
            fontWeight: 700,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: redeemed ? '#8DCFA9' : '#C7B8F5',
          }}
        >
          {code}
        </div>

        <button onClick={handleCopy} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px 18px', marginBottom: '14px' }}>
          {copied ? <Check size={14} color="#8DCFA9" /> : <Copy size={14} />}
          <span>{copied ? 'Copied to clipboard' : 'Copy message for them'}</span>
        </button>

        {/* What the buddy gets */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '11px',
            padding: '15px 17px',
            borderRadius: '14px',
            background: 'rgba(0,0,0,0.28)',
            marginBottom: '14px',
          }}
        >
          <KeyRound size={15} color="#8EDCF2" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#B8B3AA' }}>
            They open <strong style={{ color: '#FAF8F5' }}>/buddy-portal</strong>, enter this code, and create their
            own account. No forms for you to fill in, and no number to share.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '14px 16px',
            borderRadius: '13px',
            background: 'rgba(141, 207, 169, 0.08)',
            border: '1px solid rgba(141, 207, 169, 0.2)',
          }}
        >
          <EyeOff size={14} color="#8DCFA9" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#B8B3AA' }}>
            Their account is completely separate from yours. They will{' '}
            <strong style={{ color: '#8DCFA9' }}>never</strong> see what you told us, your symptoms, your
            department, or any notes — and they cannot reach any other page of the site.
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------- collapsed prompt
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '13px',
          padding: '16px 18px',
          borderRadius: '16px',
          background: 'rgba(199, 184, 245, 0.07)',
          border: '1px solid rgba(199, 184, 245, 0.22)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(199, 184, 245, 0.12)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(199, 184, 245, 0.07)')}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            background: 'rgba(199, 184, 245, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Users size={18} color="#C7B8F5" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5', marginBottom: '2px' }}>
            Add a Quiet Buddy to my request
          </div>
          <div style={{ fontSize: '12.5px', color: '#78746C' }}>
            One person who gets reminders and sees how things are going. Nothing sensitive.
          </div>
        </div>
        <ArrowRight size={16} color="#78746C" style={{ flexShrink: 0 }} />
      </button>
    );
  }

  // ------------------------------------------------------- expanded form
  return (
    <form
      onSubmit={handleGenerate}
      className="glass-panel animate-fade-in"
      style={{
        borderRadius: '20px',
        padding: compact ? '20px 22px' : '24px 26px',
        background: 'rgba(199, 184, 245, 0.06)',
        border: '1px solid rgba(199, 184, 245, 0.28)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <UserPlus size={17} color="#C7B8F5" />
          <span style={{ fontSize: '15.5px', fontWeight: 600, color: '#FAF8F5' }}>Add a Quiet Buddy</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', color: '#78746C', cursor: 'pointer', padding: '4px' }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: '13px', color: '#B8B3AA', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        Completely optional, and you can revoke it any time. You'll get a one-time code to share with them — no phone
        number, no forms, no waiting.
      </p>

      <div style={{ fontSize: '12px', color: '#B8B3AA', marginBottom: '8px' }}>Who are they to you?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '1.5rem' }}>
        {getRelationshipOptions().map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setRelationship(opt.id)}
            style={{
              padding: '6px 13px',
              borderRadius: '9999px',
              border: relationship === opt.id ? '1px solid rgba(199,184,245,0.5)' : '1px solid rgba(255,255,255,0.08)',
              background: relationship === opt.id ? 'rgba(199,184,245,0.16)' : 'rgba(255,255,255,0.03)',
              color: relationship === opt.id ? '#C7B8F5' : '#B8B3AA',
              fontSize: '12.5px',
              fontWeight: relationship === opt.id ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
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
            marginBottom: '1rem',
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13.5px', padding: '12px 20px' }}>
        <KeyRound size={15} />
        <span>Create invitation code</span>
      </button>

      <p style={{ fontSize: '11px', color: '#78746C', textAlign: 'center', marginTop: '10px' }}>
        Works once, and only for a single buddy account.
      </p>
    </form>
  );
}
