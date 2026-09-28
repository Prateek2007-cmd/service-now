import React, { useEffect, useState } from 'react';
import {
  FastForward,
  Clock,
  CalendarCheck,
  MessageSquareHeart,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Info,
  Check,
} from 'lucide-react';
import {
  subscribeDemoClock,
  advanceDays,
  advanceHours,
  demoNow,
  parseAppointmentDate,
  resetClock,
  isSimulating,
  describeClock,
  hasSessionPassed,
} from '../services/demoClockService';
import { getStore, getCurrentCase, subscribeStore, markSessionComplete, isSessionStillUpcoming } from '../services/store';

/**
 * Demo clock + guided walkthrough.
 *
 * The feedback loop depends on a session having happened and a counsellor having
 * closed it, which is impossible to show in a five minute demo otherwise. This
 * moves simulated time forward instead of real time, so the loop is one click.
 */
export default function DemoClockPanel({ onNavigate, caseObj: caseProp = null }) {
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [localCase, setLocalCase] = useState(() => getCurrentCase());

  useEffect(() => subscribeDemoClock(setOffset), []);
  useEffect(() => subscribeStore(() => setLocalCase(getCurrentCase())), []);

  // The counsellor portal works on a selected case, which is not necessarily
  // the signed-in student's own. Honour whatever the caller is looking at.
  const caseObj = caseProp || localCase;

  const appt = caseObj?.appointment;
  const passed = appt ? hasSessionPassed(appt) : null;
  const upcoming = isSessionStillUpcoming(caseObj);
  const canComplete = !!appt && appt.status === 'confirmed' && passed !== false;
  const needsCompletion = canComplete;
  const needsReview = appt?.status === 'completed' && appt.attended !== false && !appt.sessionOutcome;
  const step = needsReview ? 4 : needsCompletion ? 3 : upcoming ? 1 : 2;

  // Jump to just after the session, not a fixed number of days. Seeded
  // appointments can be a month out, so a fixed "skip 2 days" would leave the
  // session in the future forever and the button would never achieve anything.
  const handleJumpToSession = () => {
    if (!appt) return;
    const target = parseAppointmentDate(appt.date, appt.time);
    if (target === null || !Number.isFinite(target)) {
      // Unparseable date: fall back to a nudge rather than doing nothing.
      advanceDays(2);
      return;
    }
    const deltaMs = target - demoNow() + 60 * 60 * 1000; // land 1h after start
    advanceHours(Math.max(1, Math.ceil(deltaMs / (60 * 60 * 1000))));
  };

  const handleMarkDelivered = () => {
    if (!appt) return;
    markSessionComplete({ caseId: caseObj.id, appointmentId: appt.id, attended: true });
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(142, 220, 242, 0.04)',
        border: `1px solid ${isSimulating() ? 'rgba(142, 220, 242, 0.35)' : 'rgba(255,255,255,0.08)'}`,
        marginBottom: '2rem',
      }}
    >
      {/* Header bar */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          padding: '15px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <FastForward size={16} color="#8EDCF2" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>
            Demo clock
            {isSimulating() && (
              <span style={{ marginLeft: '8px', fontSize: '11.5px', color: '#8EDCF2', fontWeight: 600 }}>{describeClock()}</span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#78746C' }}>
            Skip ahead so a session can happen, so the feedback loop can be seen
          </div>
        </div>
        {open ? <ChevronUp size={16} color="#78746C" /> : <ChevronDown size={16} color="#78746C" />}
      </button>

      {open && (
        <div className="animate-fade-in" style={{ padding: '0 20px 20px' }}>
          {/* Current simulated time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.25)',
              marginBottom: '14px',
            }}
          >
            <Clock size={14} color="#8EDCF2" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#FAF8F5', fontWeight: 600 }}>
              {new Date(demoNow()).toLocaleString(undefined, {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Journey steps */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Walk the loop
            </div>

            {[
              {
                n: 1,
                label: 'Book a session',
                done: !!appt,
                action: () => onNavigate && onNavigate('/appointments'),
                actionLabel: 'Go to booking',
              },
              {
                n: 2,
                label: 'Advance time so the session happens',
                done: passed === true,
                action: handleJumpToSession,
                actionLabel: 'Jump to session',
              },
              {
                n: 3,
                label: 'Counsellor marks it delivered',
                done: appt?.status === 'completed',
                action: handleMarkDelivered,
                actionLabel: 'Mark delivered',
                disabled: !canComplete,
              },
              {
                n: 4,
                label: 'Student answers "how was it?"',
                done: !!appt?.sessionOutcome,
                action: () => onNavigate && onNavigate('/journey'),
                actionLabel: 'Open the prompt',
                disabled: !needsReview,
              },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '10px 12px',
                  borderRadius: '11px',
                  background: s.done ? 'rgba(141, 207, 169, 0.07)' : 'rgba(255,255,255,0.03)',
                  marginBottom: '7px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: s.done ? '#8DCFA9' : '#1E1D26',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.done ? '#0B0B0E' : '#78746C',
                    fontSize: '10px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.done ? <Check size={11} strokeWidth={3} /> : s.n}
                </div>
                <span style={{ flex: 1, fontSize: '13px', color: s.done ? '#B8B3AA' : '#FAF8F5' }}>{s.label}</span>
                {!s.done && (
                  <button
                    onClick={s.action}
                    disabled={s.disabled}
                    style={{
                      background: s.disabled ? 'rgba(255,255,255,0.05)' : 'rgba(142, 220, 242, 0.15)',
                      border: '1px solid ' + (s.disabled ? 'rgba(255,255,255,0.06)' : 'rgba(142, 220, 242, 0.3)'),
                      color: s.disabled ? '#4A4740' : '#8EDCF2',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '11.5px',
                      cursor: s.disabled ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {s.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Fine grained controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', alignItems: 'center' }}>
            <button
              onClick={() => advanceHours(1)}
              style={chipStyle}
            >
              +1 hour
            </button>
            <button onClick={() => advanceDays(1)} style={chipStyle}>
              +1 day
            </button>
            <button onClick={() => advanceDays(7)} style={chipStyle}>
              +1 week
            </button>
            <button
              onClick={() => advanceDays(-1)}
              style={chipStyle}
              title="Step back — sessions that were in the future return"
            >
              -1 day
            </button>
            {isSimulating() && (
              <button
                onClick={() => resetClock()}
                style={{ ...chipStyle, color: '#FCA5A5', borderColor: 'rgba(252,165,165,0.25)', background: 'rgba(252,165,165,0.08)' }}
              >
                <RotateCcw size={11} /> Back to real time
              </button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '9px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              marginTop: '14px',
            }}
          >
            <Info size={13} color="#78746C" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '11.5px', lineHeight: 1.6, color: '#78746C' }}>
              Only this panel and the session logic read the simulated time. Everything else uses the real clock, so
              resetting restores normal behaviour exactly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const chipStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#B8B3AA',
  padding: '6px 12px',
  borderRadius: '9999px',
  fontSize: '11.5px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  fontWeight: 500,
};
