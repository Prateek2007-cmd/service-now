import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  MessageSquareHeart,
  Check,
  X,
  History,
  ArrowRight,
  PhoneCall,
  ThumbsUp,
  Calendar,
  CalendarX,
} from 'lucide-react';
import {
  SESSION_QUESTIONS,
  recordSessionOutcome,
  getContinuityContext,
  isSessionAwaitingReview,
  isSessionMissed,
} from '../services/store';

/**
 * The post-session check-in.
 *
 * Fires after a session has happened and before the next booking, and is the
 * thing that stops a student having to re-explain themselves every time. It is
 * deliberately three questions long — a long survey after a hard session is the
 * fastest way to get silence, and silence is the signal we care about most.
 */
export default function SessionFeedback({ caseObj, onNavigate, onReviewed }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState({ helpful: '', heard: '', note: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (caseObj?.appointment?.sessionOutcome) {
      setSaved(true);
    }
  }, [caseObj]);

  const continuity = getContinuityContext(caseObj);
  const appt = caseObj?.appointment;

  const handleSave = () => {
    setError('');
    const result = recordSessionOutcome({
      caseId: caseObj.id,
      appointmentId: appt.id,
      answers,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setOpen(false);
    if (onReviewed) onReviewed(result.outcome);
  };

  // ---- Quiet, already-answered: continuity summary -------------------------
  if (saved && appt?.sessionOutcome) {
    const outcome = appt.sessionOutcome;
    const toneColor = outcome.tone === 'good' ? '#8DCFA9' : outcome.tone === 'mixed' ? '#EBA756' : '#F87171';

    return (
      <div
        className="glass-panel"
        style={{ borderRadius: '20px', padding: '24px 26px', background: 'rgba(141, 207, 169, 0.05)', border: '1px solid rgba(141, 207, 169, 0.2)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Check size={17} color={toneColor} />
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#FAF8F5' }}>
            Session reviewed · {outcome.label}
          </span>
        </div>

        <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#B8B3AA', marginBottom: '16px' }}>
          {outcome.tone === 'good'
            ? "Good. If you book again, this comes with you — you won't have to start from the beginning."
            : outcome.tone === 'mixed'
              ? "Noted. If you book again, the same specialist will see this, so you can pick up where you left off."
              : "That's useful to know, and it isn't wasted. Booking again carries this forward so the next session starts differently."}
        </p>

        {outcome.answers.note && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '13px 15px',
              borderRadius: '13px',
              background: 'rgba(0,0,0,0.28)',
              marginBottom: '16px',
            }}
          >
            <MessageSquareHeart size={14} color="#F4B6D7" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', lineHeight: 1.6, color: '#B8B3AA' }}>{outcome.answers.note}</span>
          </div>
        )}

        <button
          onClick={() => onNavigate && onNavigate('/appointments')}
          className="btn-secondary"
          style={{ fontSize: '13px', padding: '10px 18px' }}
        >
          <span>Book again, carrying this forward</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  // ---- Open editor ---------------------------------------------------------
  if (open) {
    return (
      <div
        className="glass-panel animate-fade-in"
        style={{ borderRadius: '20px', padding: '24px 26px', background: 'rgba(244, 182, 215, 0.06)', border: '1px solid rgba(244, 182, 215, 0.25)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <MessageSquareHeart size={17} color="#F4B6D7" />
            <span style={{ fontSize: '15.5px', fontWeight: 600, color: '#FAF8F5' }}>How was the session?</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: '#78746C', cursor: 'pointer', padding: '4px' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {SESSION_QUESTIONS.filter(q => !q.freeText).map((q) => (
          <div key={q.id} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13.5px', color: '#FAF8F5', marginBottom: '10px', fontWeight: 500 }}>{q.prompt}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {q.options.map((opt) => {
                const isActive = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.value }))}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '9999px',
                      border: isActive ? '1px solid rgba(244,182,215,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? 'rgba(244,182,215,0.16)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#F4B6D7' : '#B8B3AA',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '13.5px', color: '#FAF8F5', marginBottom: '10px', fontWeight: 500 }}>
            Anything you want added to your record? <span style={{ color: '#78746C', fontWeight: 400 }}>Optional</span>
          </div>
          <textarea
            value={answers.note}
            onChange={(e) => setAnswers((a) => ({ ...a, note: e.target.value }))}
            rows={3}
            maxLength={600}
            placeholder="One thing you want them to know next time."
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '13px',
              color: '#FAF8F5',
              fontSize: '14px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        {error && (
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(252,165,165,0.1)', border: '1px solid rgba(252,165,165,0.3)', color: '#FCA5A5', fontSize: '12.5px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button onClick={handleSave} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13.5px', padding: '12px 22px' }}>
          <Check size={15} />
          <span>Save review</span>
        </button>
        <p style={{ fontSize: '11px', color: '#78746C', textAlign: 'center', marginTop: '10px' }}>
          Shared with your care team. Never visible to your department or employer.
        </p>
      </div>
    );
  }

  // ---- Missed session: nothing to review, offer a rebook ------------------
  if (isSessionMissed(caseObj)) {
    return (
      <div
        className="glass-panel"
        style={{ borderRadius: '20px', padding: '22px 24px', background: 'rgba(248, 113, 113, 0.05)', border: '1px solid rgba(248, 113, 113, 0.22)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '11px',
              background: 'rgba(248, 113, 113, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CalendarX size={18} color="#FCA5A5" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5', marginBottom: '3px' }}>
              Your last session was missed
            </div>
            <div style={{ fontSize: '12.5px', color: '#78746C' }}>
              {appt.date} at {appt.time} with {appt.counsellor}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#B8B3AA', marginBottom: '16px' }}>
          Nothing to review, and no charge. Things get in the way — book another time whenever suits you, and
          anything you told them before still carries over.
        </p>

        <button onClick={() => onNavigate && onNavigate('/appointments')} className="btn-warm" style={{ fontSize: '13.5px', padding: '11px 20px' }}>
          <Calendar size={15} />
          <span>Book another time</span>
        </button>
      </div>
    );
  }

  // ---- Not yet delivered: stay quiet ---------------------------------------
  // The prompt is a consequence of the counsellor closing the session, not a
  // guess based on a date string. Before that, there is nothing to ask about.
  if (!appt || !isSessionAwaitingReview(caseObj)) return null;

  return (
    <div
      className="glass-panel"
      style={{ borderRadius: '20px', padding: '22px 24px', background: 'rgba(244, 182, 215, 0.05)', border: '1px solid rgba(244, 182, 215, 0.2)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px', marginBottom: '14px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            background: 'rgba(244, 182, 215, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MessageSquareHeart size={18} color="#F4B6D7" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5', marginBottom: '3px' }}>
            How was the session?
          </div>
          <div style={{ fontSize: '12.5px', color: '#78746C' }}>
            {appt.date} at {appt.time} with {appt.counsellor} · marked complete
          </div>
        </div>
      </div>

      <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#B8B3AA', marginBottom: '16px' }}>
        Two quick questions. Whatever you answer travels with you to the next session, so you never have to explain
        it twice.
      </p>

      {continuity.isReturning && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '11px 13px',
            borderRadius: '11px',
            background: 'rgba(255,255,255,0.04)',
            marginBottom: '14px',
            fontSize: '12.5px',
            color: '#B8B3AA',
          }}
        >
          <History size={14} color="#8EDCF2" style={{ flexShrink: 0 }} />
          <span>Review #{continuity.sessionCount + 1} · your previous answers are already on file</span>
        </div>
      )}

      <button onClick={() => setOpen(true)} className="btn-primary" style={{ fontSize: '13.5px', padding: '11px 20px' }}>
        <ThumbsUp size={15} />
        <span>Answer two questions</span>
      </button>
    </div>
  );
}

/**
 * Shown at the top of the booking flow when the student is returning. This is
 * the "he has already taken a session" signal the student should see before
 * choosing a new time, not after.
 */
export function BookingContinuityBanner({ caseObj, onNavigate }) {
  const continuity = getContinuityContext(caseObj);
  if (!continuity.isReturning) return null;

  const toneColor =
    continuity.lastReview?.color === '#F87171'
      ? '#FCA5A5'
      : continuity.lastReview?.color === '#EBA756'
        ? '#EBA756'
        : '#8DCFA9';

  return (
    <div
      className="glass-panel"
      style={{ borderRadius: '18px', padding: '18px 20px', background: 'rgba(142, 220, 242, 0.05)', border: '1px solid rgba(142, 220, 242, 0.2)', marginBottom: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
        <History size={16} color="#8EDCF2" />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5' }}>
          You've had {continuity.sessionCount} session{continuity.sessionCount === 1 ? '' : 's'} here already
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {continuity.previousSessions.slice(-3).map((s) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: '#B8B3AA' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span>{s.title?.replace('Session review · ', '')}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#78746C', marginTop: '12px' }}>
        Whatever you book next arrives with this history attached, so the next person you meet already knows where
        you left off. You won't be asked to start over.
      </p>

      {continuity.lastReview && continuity.lastReview.color === '#F87171' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            marginTop: '12px',
            padding: '11px 13px',
            borderRadius: '11px',
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            fontSize: '12.5px',
            color: '#FCA5A5',
          }}
        >
          <PhoneCall size={13} style={{ flexShrink: 0 }} />
          <span>If the last one didn't work, that's a reason to try someone different — say so when you book.</span>
        </div>
      )}
    </div>
  );
}
