import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';

export default function StoriesSection({ onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stories = [
    {
      id: 1,
      quote: "I was convinced I was going to fail out in my third year. I couldn’t get out of bed for seminars. HERE connected me with Dr. Sarah within 24 hours, secured a retroactive coursework pause, and helped me reset without shame.",
      author: "Maya Lin",
      program: "3rd Year Architecture",
      tag: "Academic Paralysis & Burnout",
      tagColor: "#F4B6D7",
      outcome: "Successfully completed term with 3.7 GPA & weekly wellbeing routine",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      quote: "When my father was hospitalized back home, I lost my living allowance overnight. I was two days away from eviction. Within 48 hours, HERE processed an emergency discretionary grant and gave me food voucher credits.",
      author: "Tariq Al-Mansoor",
      program: "2nd Year Computer Science (International)",
      tag: "Emergency Financial Hardship",
      tagColor: "#EBA756",
      outcome: "$1,200 emergency bursary disbursed with zero loan debt",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      quote: "As a first-generation student, I had no idea what 'mitigating circumstances' even meant. I thought university was just sink or swim. HERE spoke to me like a caring human being, not an administrative manual.",
      author: "Chloe Henderson",
      program: "1st Year Biomedicine",
      tag: "First-Gen Student Navigation",
      tagColor: "#8DCFA9",
      outcome: "Paired with a peer mentor and ongoing study coaching",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const current = stories[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: '#0B0B0E',
        overflow: 'hidden',
      }}
    >
      {/* Warm Ambient Rose & Amber Lighting */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '500px',
          height: '500px',
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
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 167, 86, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', marginBottom: '4rem' }}>
          <div>
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
              <span>Real Students • Real Experiences</span>
            </div>

            <h2 
              className="font-editorial"
              style={{
                fontSize: 'clamp(32px, 3.8vw, 54px)',
                lineHeight: 1.15,
                color: '#FAF8F5',
              }}
            >
              You are never the only one <br />
              <span style={{ color: '#F4B6D7', fontStyle: 'italic' }}>who found it hard.</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrev}
              aria-label="Previous story"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next story"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured Editorial Story Card */}
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(32px, 5vw, 60px)',
            borderRadius: '32px',
            background: 'linear-gradient(160deg, rgba(28, 27, 38, 0.9) 0%, rgba(18, 17, 24, 0.96) 100%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Left: Pull Quote & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span 
                style={{
                  background: `rgba(255, 255, 255, 0.05)`,
                  color: current.tagColor,
                  border: `1px solid ${current.tagColor}33`,
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                }}
              >
                {current.tag}
              </span>
            </div>

            <Quote size={40} color="#EBA756" style={{ opacity: 0.6 }} />

            <p 
              className="font-editorial"
              style={{
                fontSize: 'clamp(20px, 2.2vw, 28px)',
                lineHeight: 1.45,
                color: '#FAF8F5',
              }}
            >
              "{current.quote}"
            </p>

            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#FAF8F5' }}>
                {current.author}
              </div>
              <div style={{ fontSize: '13.5px', color: '#B8B3AA', marginTop: '2px' }}>
                {current.program}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px', color: '#8DCFA9' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8DCFA9' }} />
                <span>{current.outcome}</span>
              </div>
            </div>
          </div>

          {/* Right: Authentic Portrait with Warm Vignette */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                height: '460px',
                borderRadius: '26px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              }}
            >
              <img 
                src={current.photo}
                alt={current.author}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.05) brightness(0.95)',
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(11, 11, 14, 0.8) 100%)',
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  background: 'rgba(20, 20, 28, 0.85)',
                  backdropFilter: 'blur(16px)',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12.5px',
                  color: '#FAF8F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Verified University Student Voice</span>
                <span style={{ color: '#EBA756' }}>● Anonymous Option</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '2.5rem',
          }}
        >
          {stories.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                background: currentIndex === idx ? '#FAF8F5' : 'rgba(255, 255, 255, 0.15)',
                width: currentIndex === idx ? '32px' : '10px',
                height: '8px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
