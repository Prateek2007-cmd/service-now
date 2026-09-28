import React, { useMemo } from 'react';
import {
  FileText,
  Quote,
  AlertTriangle,
  Clock,
  History,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Info,
  User,
  Sparkles,
} from 'lucide-react';
import { buildCareSummary } from '../services/careSummaryService';

/**
 * The counsellor's view of a case.
 *
 * Design rule: every line here is either quoted from the student or explicitly
 * labelled as NOT stated. Nothing is inferred from the department or the
 * student's year, because that is how a summary turns into a stereotype.
 */
export default function CareSummaryView({ convState, caseObj, studentName }) {
  const summary = useMemo(
    () => buildCareSummary({ convState, caseObj, studentName }),
    [convState, caseObj, studentName]
  );

  if (!summary.hasEnoughToSummarise) {
    return (
      <div
        className="glass-panel"
        style={{ borderRadius: '20px', padding: '28px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
          <FileText size={16} color="#78746C" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Care summary
          </span>
        </div>
        <p style={{ fontSize: '13.5px', color: '#B8B3AA', lineHeight: 1.65 }}>
          {summary.messageCount === 0
            ? 'Nothing has been shared yet. This fills in as the student talks.'
            : 'Not enough has been shared to summarise responsibly. Rather than guess, this will build itself once the student has said a little more.'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{ borderRadius: '20px', padding: '28px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px' }}>
        <FileText size={16} color="#8EDCF2" />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#8EDCF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Care summary
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: '#78746C' }}>
          {summary.messageCount} message{summary.messageCount === 1 ? '' : 's'} analysed
        </span>
      </div>

      {/* Presenting concern */}
      <div style={{ fontSize: '16px', color: '#FAF8F5', fontWeight: 500, marginBottom: '20px', lineHeight: 1.5 }}>
        {summary.presentingConcern}
      </div>

      {/* Risk flags first — a clinician should never have to hunt for these */}
      {summary.risks.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {summary.risks.map((risk) => (
            <div
              key={risk.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '11px',
                padding: '14px 16px',
                borderRadius: '13px',
                marginBottom: '8px',
                background: risk.severity === 'high' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(235, 167, 86, 0.08)',
                border: `1px solid ${risk.severity === 'high' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(235, 167, 86, 0.25)'}`,
              }}
            >
              {risk.severity === 'high' ? (
                <ShieldAlert size={16} color="#FCA5A5" style={{ marginTop: 2, flexShrink: 0 }} />
              ) : (
                <AlertTriangle size={16} color="#EBA756" style={{ marginTop: 2, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: risk.severity === 'high' ? '#FCA5A5' : '#EBA756', marginBottom: '4px' }}>
                  {risk.label}
                </div>
                {risk.evidence && (
                  <div style={{ fontSize: '12.5px', color: '#B8B3AA', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{risk.evidence}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Themes, each with evidence */}
      <SectionLabel icon={Sparkles} label="Themes raised" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {summary.themes.map((theme) => (
          <div
            key={theme.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '13px 15px',
              borderRadius: '13px',
              background: 'rgba(0,0,0,0.24)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>{theme.label}</span>
                <span style={{ fontSize: '11px', color: '#78746C' }}>mentioned {theme.mentions}×</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <Quote size={11} color="#78746C" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: '#B8B3AA', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{theme.evidence}"
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact */}
      {summary.impact.length > 0 && (
        <>
          <SectionLabel icon={CheckCircle2} label="Affecting" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '20px' }}>
            {summary.impact.map((i) => (
              <span
                key={i.id}
                style={{ fontSize: '12.5px', color: '#8EDCF2', background: 'rgba(142, 220, 242, 0.1)', padding: '5px 12px', borderRadius: '9999px' }}
              >
                {i.label}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Duration — only if stated */}
      <SectionLabel icon={Clock} label="Duration" />
      <div style={{ fontSize: '13.5px', color: summary.duration ? '#FAF8F5' : '#78746C', marginBottom: '20px' }}>
        {summary.duration ? (
          <>Stated as {summary.duration.text}.</>
        ) : (
          <span style={{ fontStyle: 'italic' }}>Not stated — worth asking rather than assuming.</span>
        )}
      </div>

      {/* In their words */}
      {summary.inTheirWords.length > 0 && (
        <>
          <SectionLabel icon={MessageSquare} label="In their own words" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
            {summary.inTheirWords.map((w, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(244, 182, 215, 0.05)',
                  borderLeft: '2px solid rgba(244, 182, 215, 0.3)',
                }}
              >
                <span style={{ fontSize: '13.5px', color: '#FAF8F5', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{w.text}"
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* What they asked for */}
      {summary.askedFor.length > 0 && (
        <>
          <SectionLabel icon={User} label="What they asked for" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px' }}>
            {summary.askedFor.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                <span style={{ color: '#F4B6D7', marginTop: 1 }}>•</span>
                <span style={{ fontSize: '13px', color: '#B8B3AA', lineHeight: 1.55, fontStyle: 'italic' }}>"{a}"</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Continuity */}
      {summary.continuity.hasHistory && (
        <>
          <SectionLabel icon={History} label="Continuity" />
          <div
            style={{
              padding: '15px 17px',
              borderRadius: '13px',
              background: 'rgba(141, 207, 169, 0.07)',
              border: '1px solid rgba(141, 207, 169, 0.2)',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '13.5px', color: '#FAF8F5', fontWeight: 600, marginBottom: '6px' }}>
              Returning student · {summary.continuity.priorSessions} prior session
              {summary.continuity.priorSessions === 1 ? '' : 's'}
            </div>
            {summary.continuity.lastReviewLabel && (
              <div style={{ fontSize: '13px', color: '#B8B3AA', marginBottom: '4px' }}>
                Last review: {summary.continuity.lastReviewLabel}
              </div>
            )}
            {summary.continuity.lastSessionNote && (
              <div style={{ fontSize: '13px', color: '#B8B3AA', fontStyle: 'italic', lineHeight: 1.55, marginTop: '6px' }}>
                "{summary.continuity.lastSessionNote}"
              </div>
            )}
          </div>
        </>
      )}

      {/* What is NOT known — guards against assumption */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '14px 16px',
          borderRadius: '13px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.1)',
        }}
      >
        <Info size={14} color="#78746C" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '12px', color: '#78746C', fontWeight: 600, marginBottom: '5px' }}>
            Not established — do not assume
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {summary.notStated.duration && <MissingTag>How long this has been going on</MissingTag>}
            {summary.notStated.detail && <MissingTag>Full picture of daily impact</MissingTag>}
            {summary.notStated.risk && <MissingTag>No risk language present (absence ≠ absence of risk)</MissingTag>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
      <Icon size={13} color="#78746C" />
      <span style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

function MissingTag({ children }) {
  return (
    <span
      style={{
        fontSize: '11.5px',
        color: '#78746C',
        background: 'rgba(255,255,255,0.04)',
        padding: '3px 9px',
        borderRadius: '9999px',
      }}
    >
      {children}
    </span>
  );
}
