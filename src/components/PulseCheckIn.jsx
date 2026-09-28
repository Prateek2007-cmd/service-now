import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  Lock,
  ArrowRight,
  PhoneCall,
  X,
} from 'lucide-react';
import {
  PULSE_LEVELS,
  LEVEL_NUDGE,
  getEntries,
  subscribePulse,
  getTodayEntry,
  logPulse,
  getSeries,
  getTrend,
} from '../services/pulseService';

const TRIGGERS = ['Exams', 'Money', 'Loneliness', 'Family', 'Health', 'Housing', 'Workload', 'Sleep'];

export default function PulseCheckIn({ onNavigate, onStartChat }) {
  const [entries, setEntries] = useState(getEntries());
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => subscribePulse(setEntries), []);

  const today = useMemo(() => getTodayEntry(), [entries]);
  const series = useMemo(() => getSeries(14), [entries]);
  const trend = useMemo(() => getTrend(14), [entries]);

  useEffect(() => {
    if (today) {
      setSelected(today.level);
      setNote(today.note || '');
      setTriggers(today.triggers || []);
    }
  }, [today]);

  const openEditor = () => {
    if (today) {
      setSelected(today.level);
      setNote(today.note || '');
      setTriggers(today.triggers || []);
    }
    setExpanded(true);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    logPulse({ level: selected, note, triggers });
    setSaved(true);
    setTimeout(() => setExpanded(false), 900);
  };

  const toggleTrigger = (t) => {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const currentLevel = PULSE_LEVELS.find((l) => l.id === (today?.level ?? selected));
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? '#8DCFA9' : trend.direction === 'down' ? '#FCA5A5' : '#78746C';

  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(4rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0F0F14',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '12%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(142, 220, 242, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div
          className="glass-panel"
          style={{
            borderRadius: '28px',
            padding: 'clamp(24px, 4vw, 38px)',
            background: 'linear-gradient(150deg, rgba(26, 25, 36, 0.88) 0%, rgba(18, 17, 24, 0.95) 100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '5px 13px',
                  borderRadius: '9999px',
                  background: 'rgba(142, 220, 242, 0.12)',
                  color: '#8EDCF2',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                <Activity size={13} />
                <span>Daily Pulse</span>
              </div>
              <h2 className="font-editorial" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', color: '#FAF8F5', lineHeight: 1.2 }}>
                One honest minute a day.
              </h2>
              <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: '#B8B3AA', marginTop: '0.75rem' }}>
                Log how today actually felt. Over a fortnight the pattern is usually obvious — and it is the thing
                students most often notice before a crisis does.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '12px', color: '#78746C' }}>
              <Lock size={13} color="#8DCFA9" />
              <span>Private to this device</span>
            </div>
          </div>

          {expanded ? (
            /* ---------------- Check-in editor ---------------- */
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '13px', color: '#B8B3AA' }}>How did today actually feel?</span>
                <button
                  onClick={() => setExpanded(false)}
                  style={{ background: 'none', border: 'none', color: '#78746C', cursor: 'pointer', display: 'flex', padding: '4px' }}
                  aria-label="Close check-in"
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px',
                  marginBottom: '1.5rem',
                }}
              >
                {PULSE_LEVELS.map((level) => {
                  const isActive = selected === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelected(level.id)}
                      style={{
                        padding: '16px 14px',
                        borderRadius: '16px',
                        background: isActive ? `${level.color}1F` : 'rgba(255,255,255,0.04)',
                        border: isActive ? `1px solid ${level.color}66` : '1px solid rgba(255,255,255,0.07)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isActive ? 'translateY(-2px)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: level.color, marginBottom: '8px' }}>
                        {level.emoji}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: isActive ? level.color : '#FAF8F5' }}>
                        {level.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    borderLeft: `3px solid ${PULSE_LEVELS.find((l) => l.id === selected).color}`,
                    marginBottom: '1.5rem',
                  }}
                >
                  <ArrowRight size={15} color={PULSE_LEVELS.find((l) => l.id === selected).color} style={{ marginTop: 3, flexShrink: 0 }} />
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#B8B3AA' }}>{LEVEL_NUDGE[selected]}</p>
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#B8B3AA', marginBottom: '9px' }}>What is driving it? (optional)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                {TRIGGERS.map((t) => {
                  const isActive = triggers.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTrigger(t)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        border: isActive ? '1px solid rgba(142,220,242,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        background: isActive ? 'rgba(142,220,242,0.16)' : 'rgba(255,255,255,0.03)',
                        color: isActive ? '#8EDCF2' : '#B8B3AA',
                        fontSize: '12.5px',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={400}
                placeholder="Anything you want to put into words. Only you will ever read this."
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  color: '#FAF8F5',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                  marginBottom: '1.25rem',
                }}
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <button onClick={handleSave} disabled={!selected} className="btn-primary" style={{ fontSize: '14px', padding: '12px 24px', opacity: selected ? 1 : 0.45, cursor: selected ? 'pointer' : 'not-allowed' }}>
                  {saved ? <Check size={16} /> : <Activity size={16} />}
                  <span>{saved ? 'Saved' : 'Save today'}</span>
                </button>
                <span style={{ fontSize: '11.5px', color: '#78746C' }}>You can change today any time before midnight.</span>
              </div>
            </div>
          ) : (
            /* ---------------- Today summary + trend ---------------- */
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)', gap: 'clamp(1.75rem, 4vw, 3rem)', alignItems: 'center' }}>
              {/* Today */}
              <div>
                {today ? (
                  <>
                    <div style={{ fontSize: '12px', color: '#78746C', marginBottom: '10px' }}>Today</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: currentLevel.color, boxShadow: `0 0 12px ${currentLevel.color}` }} />
                      <span style={{ fontSize: '26px', fontWeight: 600, color: currentLevel.color }}>{currentLevel.label}</span>
                    </div>
                    {today.note && (
                      <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#B8B3AA', fontStyle: 'italic', marginBottom: '12px' }}>
                        “{today.note}”
                      </p>
                    )}
                    {today.triggers?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                        {today.triggers.map((t) => (
                          <span key={t} style={{ fontSize: '11px', color: '#8EDCF2', background: 'rgba(142,220,242,0.12)', padding: '3px 10px', borderRadius: '9999px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <button onClick={openEditor} className="btn-secondary" style={{ fontSize: '13px', padding: '9px 18px' }}>
                      <span>Update today's entry</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '12px', color: '#78746C', marginBottom: '10px' }}>Today</div>
                    <div style={{ fontSize: '26px', fontWeight: 600, color: '#FAF8F5', marginBottom: '12px' }}>Not logged yet</div>
                    <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#B8B3AA', marginBottom: '1.5rem' }}>
                      Thirty seconds. Pick the closest one — you can always add why.
                    </p>
                    <button onClick={openEditor} className="btn-primary" style={{ fontSize: '13.5px', padding: '11px 22px' }}>
                      <Activity size={15} />
                      <span>Check in now</span>
                    </button>
                  </>
                )}
              </div>

              {/* 14-day trend */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '20px',
                  padding: '22px 24px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Last 14 days
                  </span>
                  {trend.loggedDays > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: trendColor, fontWeight: 600 }}>
                      <TrendIcon size={13} />
                      {trend.loggedDays}/{trend.span} logged
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '92px', marginBottom: '14px' }}>
                  {series.map((point) => {
                    const level = PULSE_LEVELS.find((l) => l.id === point.level);
                    return (
                      <div
                        key={point.date}
                        title={level ? `${point.label} · ${level.label}` : `${point.label} · not logged`}
                        style={{
                          flex: 1,
                          height: point.level ? `${(point.level / 5) * 100}%` : '6px',
                          minHeight: '6px',
                          borderRadius: '5px',
                          background: level ? level.color : 'rgba(255,255,255,0.09)',
                          opacity: level ? 0.9 : 1,
                          transition: 'height 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#78746C' }}>
                  <span>14 days ago</span>
                  <span>Today</span>
                </div>

                {trend.loggedDays >= 2 && (
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#B8B3AA', lineHeight: 1.6 }}>
                    {trend.direction === 'down' ? (
                      <>
                        Your average has <strong style={{ color: '#FCA5A5' }}>drifted down</strong> over the last week. That is worth naming out loud —{' '}
                        <button
                          onClick={() => (onStartChat ? onStartChat('') : onNavigate && onNavigate('/chat'))}
                          style={{ background: 'none', border: 'none', color: '#F4B6D7', cursor: 'pointer', padding: 0, fontWeight: 600, textDecoration: 'underline' }}
                        >
                          talk to someone
                        </button>
                        .
                      </>
                    ) : trend.direction === 'up' ? (
                      <>
                        Your average has <strong style={{ color: '#8DCFA9' }}>lifted</strong> across the fortnight. Whatever you changed is worth keeping.
                      </>
                    ) : (
                      <>Holding roughly steady. Consistency counts for more than a good week.</>
                    )}
                  </div>
                )}

                {trend.loggedDays === 1 && (
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12.5px', color: '#78746C' }}>
                    One day in. A pattern needs a few more — come back tomorrow.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Crisis footer — always visible, never conditional */}
          {entries.some((e) => e.level === 1) && !expanded && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginTop: '1.75rem',
                padding: '15px 18px',
                borderRadius: '14px',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px', color: '#FCA5A5', fontSize: '13.5px', fontWeight: 600 }}>
                <PhoneCall size={16} />
                <span>You logged a really hard day. Please talk to a person, not a page.</span>
              </div>
              <a
                href="tel:8002738255"
                className="btn-warm"
                style={{ fontSize: '13px', padding: '9px 20px', textDecoration: 'none' }}
              >
                <span>Call (800) 273-8255</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
