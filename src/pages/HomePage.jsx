import React from 'react';
import Hero from '../components/Hero';
import HowItWorksSection from '../components/HowItWorksSection';
import SupportGrid from '../components/SupportGrid';
import MyJourneyView from '../components/MyJourneyView';
import StoriesSection from '../components/StoriesSection';
import PulseCheckIn from '../components/PulseCheckIn';
import ResourcesSection from '../components/ResourcesSection';
import FooterCTA from '../components/FooterCTA';

export default function HomePage({ onNavigate, onStartChat }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-deep)', width: '100%', overflowX: 'hidden' }}>
      {/* 1. Hero Landing with 100-Frame Hover Animation & Thoughts */}
      <Hero onNavigate={onNavigate} onStartChat={onStartChat} />

      {/* 2. From confusion to clarity in four simple steps */}
      <HowItWorksSection onNavigate={onNavigate} />

      {/* 3. Support / All your support, in one place */}
      <SupportGrid onNavigate={onNavigate} />

      {/* 4. My Journey / Your journey, our support */}
      <MyJourneyView onNavigate={onNavigate} />

      {/* 5. Daily Pulse / One honest minute a day */}
      <PulseCheckIn onNavigate={onNavigate} onStartChat={onStartChat} />

      {/* 6. Stories / The anonymous story wall */}
      <StoriesSection onNavigate={onNavigate} onStartChat={onStartChat} />

      {/* 7. Resources / Helpful resources for your journey */}
      <ResourcesSection onNavigate={onNavigate} />

      {/* 8. Bottom CTA / Support is just a conversation away */}
      <FooterCTA onNavigate={onNavigate} />
    </div>
  );
}
