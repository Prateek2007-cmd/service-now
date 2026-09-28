import React, { useEffect, useState } from 'react';
import {
  Users,
  Check,
  Bell,
  Calendar,
  EyeOff,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  getBuddyState,
  subscribeBuddy,
  getBuddyView,
  getRedactedPreview,
  acceptInvite,
  BUDDY_MILESTONES,
} from '../services/quietBuddyService';

/**
 * The buddy's view. Takes ONLY a case object and immediately reduces it through
 * getBuddyView(), which allowlists four fields. Nothing else from the case is
 * ever read into this component.
 */
export function BuddyTrackerView({ caseObj, studentName }) {
  const [, force] = useState(0);
  useEffect(() => subscribeBuddy(() => force((n) => n + 1)), []);

  const view = getBuddyView(caseObj);
  if (!view) return null;

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        background: '#0F0F14',
        borderRadius: '24px',
        padding: '32px 28px',
        border: '1px solid rgba(199, 184, 245, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '20px' }}>
        <Users size={17} color="#C7B8F5" />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#C7B8F5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Quiet Buddy
        </span>
      </div>

      <h2 className="font-editorial" style={{ fontSize: '28px', color: '#FAF8F5', lineHeight: 1.25, marginBottom: '10px' }}>
        You're helping {view.studentFirstName}.
      </h2>
      <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#B8B3AA', marginBottom: '26px' }}>
        Thanks for being there. That's genuinely the thing that helps most. Here's where things stand.
      </p>

      {/* Appointment */}
      {view.appointment ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
            padding: '16px 18px',
            borderRadius: '16px',
            background: 'rgba(235, 167, 86, 0.1)',
            border: '1px solid rgba(235, 167, 86, 0.25)',
            marginBottom: '26px',
          }}
        >
          <Calendar size={19} color="#EBA756" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5' }}>
              {view.appointment.date} at {view.appointment.time}
            </div>
            <div style={{ fontSize: '13px', color: '#B8B3AA', marginTop: '2px' }}>{view.appointment.location}</div>
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
            marginBottom: '26px',
            fontSize: '13.5px',
            color: '#B8B3AA',
          }}
        >
          <Calendar size={16} color="#78746C" style={{ flexShrink: 0 }} />
          <span>Nothing booked yet. You'll get a text when there is.</span>
        </div>
      )}

      {/* Milestones */}
      <div style={{ fontSize: '11.5px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>
        Progress
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '26px' }}>
        {view.milestones.map((m, i) => {
          const isDone = m.state === 'done';
          const isCurrent = m.state === 'current';
          return (
            <div key={m.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              {/* Rail */}
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
                {i < view.milestones.length - 1 && (
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
      {view.reminders.length > 0 && (
        <>
          <div style={{ fontSize: '11.5px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
            Reminders sent
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '26px' }}>
            {view.reminders.map((r) => (
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

      {/* What you won't see */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '11px',
          padding: '15px 17px',
          borderRadius: '14px',
          background: 'rgba(141, 207, 169, 0.08)',
          border: '1px solid rgba(141, 207, 169, 0.2)',
        }}
      >
        <ShieldCheck size={16} color="#8DCFA9" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#8DCFA9', marginBottom: '4px' }}>
            This is all you can see
          </div>
          <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#B8B3AA' }}>
            {studentName || view.studentFirstName} hasn't shared what they're going through, and you won't be told.
            If they want to talk, they'll tell you.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * The student's side: a live preview of exactly what the buddy sees, so the
 * redaction promise is visible rather than just asserted.
 */
export function BuddyPrivacyPreview({ caseObj, studentName, onNavigate }) {
  const [, force] = useState(0);
  useEffect(() => subscribeBuddy(() => force((n) => n + 1)), []);

  const state = getBuddyState();
  if (!state.buddy) return null;

  const preview = getRedactedPreview(caseObj);
  if (!preview) return null;

  return (
    <div
      className="glass-panel"
      style={{ borderRadius: '20px', padding: '24px 26px', marginTop: '1.25rem', background: 'rgba(199,184,245,0.05)', border: '1px solid rgba(199,184,245,0.2)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '6px' }}>
        <EyeOff size={16} color="#C7B8F5" />
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#FAF8F5' }}>What your Quiet Buddy can see</span>
      </div>
      <p style={{ fontSize: '13px', color: '#B8B3AA', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        Exactly this. Nothing more, at any point in the process.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Their first name', value: preview.showsFirstName, icon: Users, color: '#C7B8F5' },
          { label: 'Progress', value: preview.showsMilestone, icon: Sparkles, color: '#8DCFA9' },
          { label: 'Next appointment', value: preview.showsAppointment || 'Once booked', icon: Calendar, color: '#EBA756' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{ padding: '14px 15px', borderRadius: '14px', background: 'rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: '7px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Icon size={13} color={item.color} />
                <span style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5' }}>{item.value}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '14px 16px',
          borderRadius: '13px',
          background: 'rgba(239, 68, 68, 0.07)',
          border: '1px solid rgba(239, 68, 68, 0.18)',
        }}
      >
        <Info size={14} color="#FCA5A5" style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#FCA5A5', fontWeight: 600, marginBottom: '6px' }}>
            Never shared with them
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {preview.hiddenFields.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: '11.5px',
                  color: '#B8B3AA',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  textDecoration: 'line-through',
                  textDecorationColor: 'rgba(252,165,165,0.5)',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
