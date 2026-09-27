import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Play, 
  Users, 
  X 
} from 'lucide-react';

const TOTAL_FRAMES = 100;

export default function Hero({ onNavigate, onStartChat }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const animFrameId = useRef(null);
  const frameCurrentRef = useRef(0);

  // Preload all 100 frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/frames/frame_${paddedIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setFramesLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setFramesLoaded(true);
        }
      };

      imgs.push(img);
    }

    imagesRef.current = imgs;

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Continuous seamless cinematic loop: 0 -> 99 -> pause 1.6s -> 99 -> 0 -> pause 1s -> repeat
  useEffect(() => {
    let lastTime = performance.now();
    const fps = 28; // Natural, cinematic playback speed
    const interval = 1000 / fps;
    let direction = 1; // 1 = forward, -1 = reverse
    let pauseUntil = 0;

    const renderLoop = (now) => {
      if (now < pauseUntil) {
        animFrameId.current = requestAnimationFrame(renderLoop);
        return;
      }

      const delta = now - lastTime;

      if (delta >= interval) {
        lastTime = now - (delta % interval);

        let nextFrame = frameCurrentRef.current + direction;

        if (nextFrame >= TOTAL_FRAMES - 1) {
          nextFrame = TOTAL_FRAMES - 1;
          direction = -1;
          pauseUntil = now + 1800; // Hold at the illuminated calm state for 1.8s
        } else if (nextFrame <= 0) {
          nextFrame = 0;
          direction = 1;
          pauseUntil = now + 1000; // Hold at initial state for 1s
        }

        frameCurrentRef.current = nextFrame;
        drawFrame(nextFrame);
        setCurrentFrame(nextFrame);
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [framesLoaded]);

  // Draw frame on canvas with proper aspect ratio cover
  const drawFrame = (frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIdx];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (cw - iw * ratio) / 2;
    const centerShiftY = (ch - ih * ratio) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(
      img,
      0,
      0,
      iw,
      ih,
      centerShiftX,
      centerShiftY,
      iw * ratio,
      ih * ratio
    );
  };

  // Resize canvas to match container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawFrame(frameCurrentRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [framesLoaded]);

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-deep)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '90px',
        paddingBottom: '60px',
      }}
    >
      {/* Background Canvas for Frame Sequence */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />
        {/* Subtle dark gradient overlay to ensure UI elements are ultra-crisp and legible */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 25% 45%, rgba(11,11,14,0.68) 0%, rgba(11,11,14,0.2) 60%, rgba(11,11,14,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Main Hero Foreground Content */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 620px) 1fr',
          alignItems: 'center',
          gap: '2rem',
          flex: 1,
        }}
      >
        {/* Left Column: Hero Typography & CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pill Badge */}
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(28, 27, 36, 0.65)',
                border: 'none',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                color: '#FAF8F5',
                boxShadow: 'none',
              }}
            >
              <Users size={14} color="#EBA756" />
              <span>One place. All student support.</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 
            style={{
              fontSize: 'clamp(42px, 5vw, 70px)',
              lineHeight: 1.08,
              fontWeight: 650,
              letterSpacing: '-0.025em',
              color: '#FAF8F5',
              fontFamily: 'var(--font-display)',
            }}
          >
            You don’t have to <br />
            figure it <span style={{ color: '#F4B6D7' }}>all out.</span>
          </h1>

          {/* Supporting Copy */}
          <p 
            style={{
              fontSize: 'clamp(15px, 1.15vw, 17.5px)',
              lineHeight: 1.6,
              color: '#B8B3AA',
              maxWidth: '520px',
            }}
          >
            Academic, personal, financial — whatever it is. <br />
            HERE helps you find the right support, at the right time.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', paddingTop: '8px' }}>
            <button
              onClick={() => onNavigate('/chat')}
              className="btn-primary"
              style={{
                padding: '13px 26px',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              <span>Start privately</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={() => setVideoModalOpen(true)}
              className="btn-secondary"
              style={{
                padding: '13px 22px',
                fontSize: '14.5px',
                cursor: 'pointer',
              }}
            >
              <Play size={16} fill="currentColor" color="#F4B6D7" />
              <span>Watch how it works</span>
            </button>
          </div>
        </div>

        {/* Right Area: Completely clean, unobstructed view of the cinematic room & continuous video loop */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '440px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Video Modal: "Watch how it works" */}
      {videoModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setVideoModalOpen(false)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '860px',
              width: '100%',
              background: '#16151E',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F4B6D7' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5' }}>HERE — How it works walkthrough</span>
              </div>
              <button 
                onClick={() => setVideoModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B8B3AA',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
              <video 
                src="/video.mp4" 
                controls 
                autoPlay 
                style={{ width: '100%', maxHeight: '480px', display: 'block' }}
              />
            </div>

            <div style={{ padding: '16px 20px', fontSize: '13.5px', color: '#B8B3AA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>One unified front door across 12 university support departments.</span>
              <button 
                onClick={() => {
                  setVideoModalOpen(false);
                  onNavigate('/chat');
                }}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                <span>Try it now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
