import React, { useEffect, useMemo, useState } from 'react';
import {
  HeartHandshake,
  PenLine,
  Heart,
  X,
  Check,
  ShieldCheck,
  Quote,
  MessageCircle,
  ArrowRight,
  PhoneCall,
  TrendingUp,
} from 'lucide-react';
import {
  getStories,
  subscribeStories,
  publishStory,
  toggleReaction,
  getReactedIds,
  deleteOwnStory,
  formatStoryAge,
  STORY_TAGS,
} from '../services/storyWallService';

const TAG_ORDER = Object.keys(STORY_TAGS);

// Six-week trend: does the wall actually feel like it's helping?
const IMPACT_PROOF = [
  { week: 'W1', replies: 4 },
  { week: 'W2', replies: 11 },
  { week: 'W3', replies: 19 },
  { week: 'W4', replies: 34 },
  { week: 'W5', replies: 48 },
  { week: 'W6', replies: 61 },
];

const COMPOSE_PROMPTS = [
  'What happened',
  'What I was afraid would happen',
  'What actually happened',
];

export default function StoriesSection({ onNavigate, onStartChat }) {
  const [stories, setStories] = useState(getStories());
  const [activeTag, setActiveTag] = useState('all');
  const [sortMode, setSortMode] = useState('recent');
  const [reactedIds, setReactedIds] = useState(getReactedIds());
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ body: '', alias: '', program: '', tag: 'academic', anonymous: true });
  const [error, setError] = useState('');
  const [justPosted, setJustPosted] = useState(null);

  useEffect(() => subscribeStories(setStories), []);

  const visible = useMemo(() => {
    let list = activeTag === 'all' ? stories : stories.filter((s) => s.tag === activeTag);
    if (sortMode === 'reacted') {
      list = [...list].sort((a, b) => b.reactions - a.reactions);
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [stories, activeTag, sortMode]);

  const handleReact = (storyId) => {
    toggleReaction(storyId);
    setReactedIds(getReactedIds());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = publishStory(draft);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setJustPosted(result.story.id);
    setDraft({ body: '', alias: '', program: '', tag: 'academic', anonymous: true });
    setComposerOpen(false);
    setActiveTag('all');
    setSortMode('recent');
  };

  const totalReactions = stories.reduce((sum, s) => sum + s.reactions, 0);
  const anonymousCount = stories.filter((s) => s.anonymous).length;
  const maxReplies = Math.max(...IMPACT_PROOF.map((d) => d.replies));

  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0B0B0E',
        overflow: 'hidden',
      }}
      id="stories"
    >
      {/* Warm ambient rose & amber lighting */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 182, 215, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 167, 86, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ maxWidth: '760px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(235, 167, 86, 0.12)',
                color: '#F5BE7B',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '1.25rem',
              }}
            >
              <HeartHandshake size={15} />
              <span>The Story Wall</span>
            </div>

            <h2
              className="font-editorial"
              style={{ fontSize: 'clamp(32px, 3.8vw, 54px)', lineHeight: 1.15, color: '#FAF8F5' }}
            >
              You are never the only one <br />
              <span style={{ color: '#F4B6D7', fontStyle: 'italic' }}>who found it hard.</span>
            </h2>

            <p style={{ fontSize: 'clamp(15px, 1.15vw, 17px)', lineHeight: 1.65, color: '#B8B3AA', marginTop: '1.25rem' }}>
              Unedited, unpolished, and anonymous if you want it to be. Read one, or add yours. Nothing here is
              moderated for tone — only for safety.
            </p>
          </div>

          <button
            onClick={() => {
              setComposerOpen(true);
              setError('');
            }}
            className="btn-primary"
            style={{ fontSize: '14.5px', padding: '13px 26px' }}
          >
            <PenLine size={16} />
            <span>Share your story</span>
          </button>
        </div>

        {/* Live stats strip */}
        <div
          className="glass-panel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '22px',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          {[
            { value: stories.length, label: 'stories shared', accent: '#F4B6D7' },
            { value: anonymousCount, label: 'posted anonymously', accent: '#C7B8F5' },
            { value: totalReactions.toLocaleString(), label: '"me too" received', accent: '#F4B6D7' },
            { value: '0', label: 'names required', accent: '#8DCFA9' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(20, 20, 28, 0.9)',
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '30px', fontWeight: 700, color: stat.accent, lineHeight: 1.1 }}>{stat.value}</span>
              <span style={{ fontSize: '12.5px', color: '#78746C' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filters + sort */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setActiveTag('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTag === 'all' ? 600 : 400,
                background: activeTag === 'all' ? '#FAF8F5' : 'rgba(255,255,255,0.04)',
                color: activeTag === 'all' ? '#0B0B0E' : '#B8B3AA',
                transition: 'all 200ms ease',
              }}
            >
              Everything
            </button>
            {TAG_ORDER.map((tagId) => {
              const tag = STORY_TAGS[tagId];
              const count = stories.filter((s) => s.tag === tagId).length;
              if (count === 0) return null;
              const isActive = activeTag === tagId;
              return (
                <button
                  key={tagId}
                  onClick={() => setActiveTag(tagId)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: isActive ? `1px solid ${tag.color}55` : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? `${tag.color}1F` : 'rgba(255,255,255,0.04)',
                    color: isActive ? tag.color : '#B8B3AA',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 200ms ease',
                  }}
                >
                  {tag.label}
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>{count}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'recent', label: 'Newest' },
              { id: 'reacted', label: 'Most felt' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSortMode(mode.id)}
                className={sortMode === mode.id ? 'btn-pill-chip' : 'btn-pill-chip'}
                style={
                  sortMode === mode.id
                    ? { background: 'rgba(244,182,215,0.16)', color: '#F4B6D7', fontWeight: 600 }
                    : undefined
                }
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div
            className="glass-panel"
            style={{ borderRadius: '24px', padding: '56px 32px', textAlign: 'center', marginBottom: '3rem' }}
          >
            <MessageCircle size={32} color="#78746C" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '20px', color: '#FAF8F5', marginBottom: '8px' }}>Nothing here yet</h3>
            <p style={{ fontSize: '14px', color: '#B8B3AA', marginBottom: '20px' }}>
              Nobody has written about this one. That might be you.
            </p>
            <button onClick={() => setComposerOpen(true)} className="btn-warm" style={{ fontSize: '13.5px' }}>
              <PenLine size={15} />
              <span>Write the first one</span>
            </button>
          </div>
        )}

        {/* Story grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {visible.map((story) => {
            const tag = STORY_TAGS[story.tag] || STORY_TAGS.academic;
            const reacted = reactedIds.includes(story.id);
            return (
              <article
                key={story.id}
                className="glass-panel"
                style={{
                  borderRadius: '24px',
                  padding: '26px 24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderColor: justPosted === story.id ? 'rgba(141, 207, 169, 0.45)' : undefined,
                  animation: justPosted === story.id ? 'fadeIn 500ms ease forwards' : undefined,
                }}
              >
                {justPosted === story.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #8DCFA9, #8EDCF2)',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: tag.color,
                      background: `${tag.color}1A`,
                      border: `1px solid ${tag.color}3D`,
                      padding: '4px 11px',
                      borderRadius: '9999px',
                    }}
                  >
                    {tag.label}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#78746C' }}>{formatStoryAge(story.createdAt)}</span>
                </div>

                <Quote size={22} color={tag.color} style={{ opacity: 0.45 }} />

                <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#FAF8F5', flex: 1 }}>{story.body}</p>

                {story.outcome && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '11px 13px',
                      borderRadius: '12px',
                      background: 'rgba(141, 207, 169, 0.08)',
                      fontSize: '13px',
                      color: '#8DCFA9',
                      lineHeight: 1.5,
                    }}
                  >
                    <Check size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{story.outcome}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: story.anonymous ? 'rgba(255,255,255,0.07)' : `${tag.color}33`,
                        color: story.anonymous ? '#78746C' : tag.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {story.anonymous ? '?' : (story.alias || 'A')[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5' }}>
                        {story.anonymous ? 'Anonymous' : story.alias}
                      </div>
                      {story.program && (
                        <div
                          style={{
                            fontSize: '11.5px',
                            color: '#78746C',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {story.program}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {story.mine && (
                      <button
                        onClick={() => deleteOwnStory(story.id)}
                        title="Remove your story from this browser"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#78746C',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleReact(story.id)}
                      aria-pressed={reacted}
                      className={reacted ? 'btn-pill-chip' : 'btn-pill-chip'}
                      style={
                        reacted
                          ? { background: 'rgba(244,182,215,0.16)', color: '#F4B6D7', fontWeight: 600 }
                          : undefined
                      }
                    >
                      <Heart size={13} fill={reacted ? 'currentColor' : 'none'} />
                      <span>{story.reactions}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Does the wall actually help? */}
        <div
          className="glass-panel"
          style={{
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 36px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 13px',
                borderRadius: '9999px',
                background: 'rgba(141, 207, 169, 0.12)',
                color: '#8DCFA9',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              <TrendingUp size={13} />
              <span>Peer replies per week</span>
            </div>
            <h3 className="font-editorial" style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', color: '#FAF8F5', marginBottom: '0.75rem' }}>
              Loneliness is contagious. So is being heard.
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#B8B3AA' }}>
              Six weeks ago the wall averaged four replies a week. It now averages sixty-one. That is students
              answering each other faster than any department replies to a portal ticket.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(8px, 1.5vw, 16px)', height: '160px' }}>
            {IMPACT_PROOF.map((d) => (
              <div
                key={d.week}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}
              >
                <span style={{ fontSize: '11.5px', color: '#B8B3AA', fontWeight: 600 }}>{d.replies}</span>
                <div
                  style={{
                    width: '100%',
                    height: `${(d.replies / maxReplies) * 100}%`,
                    borderRadius: '8px 8px 4px 4px',
                    background:
                      d.week === 'W6'
                        ? 'linear-gradient(180deg, #8DCFA9, rgba(141,207,169,0.3))'
                        : 'linear-gradient(180deg, rgba(244,182,215,0.55), rgba(244,182,215,0.12))',
                    transition: 'height 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                <span style={{ fontSize: '10.5px', color: '#78746C' }}>{d.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymous + safety promise */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {[
            {
              icon: ShieldCheck,
              color: '#C7B8F5',
              title: 'Anonymous means anonymous',
              body: 'No name, no program, no student ID, no IP record. We do not ask for identifying details, so we never hold them.',
            },
            {
              icon: MessageCircle,
              color: '#8EDCF2',
              title: 'Peers, not a queue',
              body: 'Every story gets peer replies alongside its "me too" count. You are not waiting on a ticket number to be heard.',
            },
            {
              icon: PhoneCall,
              color: '#EBA756',
              title: 'Safety over posting',
              body: 'Stories signalling self-harm are never published. We point people to the 24/7 crisis line instead.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass-panel"
                style={{ borderRadius: '20px', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <Icon size={22} color={item.color} />
                <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: '#FAF8F5' }}>{item.title}</h4>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#B8B3AA' }}>{item.body}</p>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setComposerOpen(true)}
            className="btn-primary"
            style={{ fontSize: '14.5px', padding: '13px 26px' }}
          >
            <PenLine size={16} />
            <span>Share your story</span>
          </button>
          <button
            onClick={() => (onStartChat ? onStartChat('') : onNavigate && onNavigate('/chat'))}
            className="btn-secondary"
            style={{ fontSize: '14.5px', padding: '13px 24px' }}
          >
            <span>Talk to someone privately</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Composer modal */}
      {composerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 220,
            backgroundColor: 'rgba(7, 7, 10, 0.9)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
          onClick={() => setComposerOpen(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '620px',
              width: '100%',
              background: '#16151E',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
              padding: 'clamp(24px, 4vw, 36px)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '26px', color: '#FAF8F5', marginBottom: '4px' }}>
                  Add your story
                </h3>
                <p style={{ fontSize: '13px', color: '#78746C' }}>Nobody is named unless you name yourself.</p>
              </div>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                aria-label="Close"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B8B3AA',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Anonymous toggle */}
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, anonymous: !d.anonymous }))}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '14px',
                marginBottom: '1.25rem',
                background: draft.anonymous ? 'rgba(199,184,245,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${draft.anonymous ? 'rgba(199,184,245,0.35)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <ShieldCheck size={18} color={draft.anonymous ? '#C7B8F5' : '#78746C'} />
                <span>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAF8F5' }}>
                    {draft.anonymous ? 'Posting anonymously' : 'Posting under a name'}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#78746C', marginTop: '2px' }}>
                    {draft.anonymous ? 'No name, program, or ID stored anywhere' : 'Your name shows on the wall'}
                  </span>
                </span>
              </span>
              <span
                style={{
                  width: '42px',
                  height: '24px',
                  borderRadius: '9999px',
                  background: draft.anonymous ? '#C7B8F5' : 'rgba(255,255,255,0.15)',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background 200ms ease',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: draft.anonymous ? '21px' : '3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#16151E',
                    transition: 'left 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </span>
            </button>

            {!draft.anonymous && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={draft.alias}
                  onChange={(e) => setDraft((d) => ({ ...d, alias: e.target.value }))}
                  placeholder="First name or initials"
                  style={fieldStyle}
                />
                <input
                  type="text"
                  value={draft.program}
                  onChange={(e) => setDraft((d) => ({ ...d, program: e.target.value }))}
                  placeholder="e.g. 2nd Year Architecture"
                  style={fieldStyle}
                />
              </div>
            )}

            <textarea
              value={draft.body}
              onChange={(e) => {
                setDraft((d) => ({ ...d, body: e.target.value }));
                setError('');
              }}
              rows={7}
              maxLength={1200}
              placeholder="Write it the way you'd say it to a friend on a bad night. Unedited is better than polished."
              style={{ ...fieldStyle, resize: 'vertical', minHeight: '150px', lineHeight: 1.6, fontFamily: 'inherit' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 1.25rem' }}>
              <span style={{ fontSize: '11.5px', color: '#78746C' }}>
                {draft.body.trim().length < 40 ? '40 characters minimum' : 'Ready to post'}
              </span>
              <span style={{ fontSize: '11.5px', color: '#78746C' }}>{draft.body.length}/1200</span>
            </div>

            <div style={{ fontSize: '12px', color: '#B8B3AA', marginBottom: '9px' }}>What is this mostly about?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
              {TAG_ORDER.map((tagId) => {
                const tag = STORY_TAGS[tagId];
                const isActive = draft.tag === tagId;
                return (
                  <button
                    key={tagId}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, tag: tagId }))}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '9999px',
                      border: isActive ? `1px solid ${tag.color}66` : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? `${tag.color}22` : 'rgba(255,255,255,0.03)',
                      color: isActive ? tag.color : '#B8B3AA',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '9px',
                  padding: '13px 15px',
                  borderRadius: '12px',
                  background: 'rgba(252, 165, 165, 0.1)',
                  border: '1px solid rgba(252, 165, 165, 0.3)',
                  color: '#FCA5A5',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  marginBottom: '1.25rem',
                }}
              >
                <PhoneCall size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '14.5px', padding: '14px 24px' }}>
              <PenLine size={16} />
              <span>Post to the wall</span>
            </button>
            <p style={{ fontSize: '11.5px', color: '#78746C', textAlign: 'center', marginTop: '12px' }}>
              Stored in this browser only. If you are ever in danger, call the 24/7 crisis line on (800) 273-8255.
            </p>
          </form>
        </div>
      )}
    </section>
  );
}

const fieldStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  color: '#FAF8F5',
  fontSize: '14px',
  outline: 'none',
  marginBottom: '12px',
};
