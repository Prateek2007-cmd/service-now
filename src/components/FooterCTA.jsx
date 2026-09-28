import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles, PhoneCall, Lock } from 'lucide-react';
import { subscribeLanguage, t } from '../services/i18nService';

export default function FooterCTA({ onNavigate }) {
  // Re-render when the interface language changes so chrome strings update.
  const [, force] = useState(0);
  useEffect(() => subscribeLanguage(() => force((n) => n + 1)), []);

  return (
    <footer 
      style={{
        position: 'relative',
        backgroundColor: '#0B0B0E',
        overflow: 'hidden',
      }}
    >
      {/* Warm Ambient Horizon Glow */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '350px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(235, 167, 86, 0.1) 0%, rgba(244, 182, 215, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Closing Sanctuary Call to Action */}
      <div 
        style={{
          position: 'relative',
          padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '1360px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
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
            marginBottom: '1.5rem',
          }}
        >
          <Heart size={14} color="#F4B6D7" />
          <span>One place. All student support.</span>
        </div>

        <h2 
          className="font-editorial"
          style={{
            fontSize: 'clamp(38px, 5vw, 68px)',
            lineHeight: 1.1,
            color: '#FAF8F5',
            maxWidth: '850px',
            marginBottom: '1.5rem',
          }}
        >
          You’ve carried this on your own <br />
          <span style={{ color: '#F4B6D7', fontStyle: 'italic' }}>long enough.</span>
        </h2>

        <p 
          style={{
            fontSize: 'clamp(16px, 1.25vw, 19px)',
            lineHeight: 1.6,
            color: '#B8B3AA',
            maxWidth: '600px',
            marginBottom: '2.5rem',
          }}
        >
          Academic, personal, financial — whatever it is, HERE is your calm front door. 100% confidential. No gatekeeping. Free for all students.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem' }}>
          <button
            onClick={() => onNavigate('/chat')}
            className="btn-primary"
            style={{ fontSize: '15px', padding: '14px 32px' }}
          >
            <span>Start privately</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => onNavigate('/how-it-works')}
            className="btn-secondary"
            style={{ fontSize: '15px', padding: '14px 28px' }}
          >
            <span>Explore how it works</span>
          </button>
        </div>

        {/* Reassurance Badges */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            fontSize: '13px',
            color: '#78746C',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            width: '100%',
            maxWidth: '900px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={15} color="#8DCFA9" />
            <span>100% FERPA Protected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={15} color="#EBA756" />
            <span>Zero Records to Professors</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={15} color="#F4B6D7" />
            <span>Free For All Enrolled Students</span>
          </div>
        </div>
      </div>

      {/* Immediate 24/7 Crisis Hotline Bar */}
      <div 
        style={{
          background: 'rgba(20, 19, 26, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '16px clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <div 
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FAF8F5' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F4B6D7', boxShadow: '0 0 8px #F4B6D7' }} />
            <span style={{ fontWeight: 600 }}>{t('cta.crisis')}</span>
            <span style={{ color: '#B8B3AA' }}>{t('cta.crisisBody')}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', color: '#EBA756' }}>
            <span style={{ background: 'rgba(235, 167, 86, 0.1)', padding: '4px 12px', borderRadius: '9999px', fontWeight: 600 }}>
              Text HOME to 741741
            </span>
            <span style={{ color: '#78746C' }}>•</span>
            <span style={{ color: '#FAF8F5' }}>Campus Crisis Line: (800) 273-8255</span>
          </div>
        </div>
      </div>

      {/* Calm Bottom Footer Links */}
      <div 
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '3rem clamp(1.5rem, 5vw, 4rem)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid rgba(250, 248, 245, 0.85)',
              borderRightColor: '#F4B6D7',
            }}
          />
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.12em', color: '#FAF8F5' }}>
            HERE
          </span>
          <span style={{ fontSize: '13px', color: '#78746C', marginLeft: '12px' }}>
            © {new Date().getFullYear()} University Student Support Sanctuary. All rights reserved.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '13px', color: '#B8B3AA' }}>
          <button 
            onClick={() => onNavigate('/privacy')} 
            style={{ background: 'none', border: 'none', color: '#B8B3AA', cursor: 'pointer' }}
          >
            {t('footer.privacy')}
          </button>
          <button 
            onClick={() => onNavigate('/help')} 
            style={{ background: 'none', border: 'none', color: '#B8B3AA', cursor: 'pointer' }}
          >
            {t('footer.crisis')}
          </button>
          <button 
            onClick={() => onNavigate('/quiet-buddy')} 
            style={{ background: 'none', border: 'none', color: '#B8B3AA', cursor: 'pointer' }}
          >
            {t('footer.buddy')}
          </button>
          <button 
            onClick={() => onNavigate('/stories')} 
            style={{ background: 'none', border: 'none', color: '#B8B3AA', cursor: 'pointer' }}
          >
            Story Wall
          </button>
          <button 
            onClick={() => onNavigate('/about')} 
            style={{ background: 'none', border: 'none', color: '#B8B3AA', cursor: 'pointer' }}
          >
            {t('footer.about')}
          </button>
          <button 
            onClick={() => onNavigate('/settings')} 
            style={{ background: 'none', border: 'none', color: '#B8B3AA', cursor: 'pointer' }}
          >
            {t('footer.settings')}
          </button>
        </div>
      </div>
    </footer>
  );
}
