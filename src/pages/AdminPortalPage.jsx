import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Sliders, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Database,
  Eye,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { getStore, subscribeStore, resetDemoData, cancelAppointmentAndTriggerWaitlistSwap } from '../services/store';

export default function AdminPortalPage({ onNavigate }) {
  const [storeState, setStoreState] = useState(getStore());
  const [activeTab, setActiveTab] = useState('pulse'); // 'pulse' | 'departments' | 'simulator' | 'routing'
  
  // What-If Simulator state
  const [capacityAdjustment, setCapacityAdjustment] = useState(-15); // e.g. -15% capacity
  const [demandShift, setDemandShift] = useState(20); // +20% midterm exam surge
  
  const [resetSuccess, setResetSuccess] = useState(false);
  const [swapAlert, setSwapAlert] = useState(false);

  useEffect(() => {
    return subscribeStore((updated) => {
      setStoreState({ ...updated });
    });
  }, []);

  const departments = storeState.departments || [];
  const pulse = storeState.campusPulse || {};
  const cases = storeState.cases || [];

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleSimulateSwap = () => {
    cancelAppointmentAndTriggerWaitlistSwap('APT-9041');
    setSwapAlert(true);
    setTimeout(() => setSwapAlert(false), 5000);
  };

  // What-if calculated impacts
  const simulatedQueueIncrease = Math.round(Math.abs(capacityAdjustment) * 1.8 + demandShift * 1.2);
  const simulatedWaitIncrease = (simulatedQueueIncrease * 0.15).toFixed(1);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#0B0B0E', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3.5rem)' }}>
        
        {/* Admin Header & Demo Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: 'rgba(235, 167, 86, 0.12)',
                color: '#EBA756',
                fontSize: '12.5px',
                fontWeight: 500,
                marginBottom: '0.75rem',
              }}
            >
              <Cpu size={14} />
              <span>University Operations & Multi-Department Routing Console</span>
            </div>
            <h1 
              style={{
                fontSize: 'clamp(28px, 3.2vw, 42px)',
                fontWeight: 650,
                color: '#FAF8F5',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              HERE Operational Cockpit
            </h1>
            <p style={{ fontSize: '15px', color: '#B8B3AA', marginTop: '4px' }}>
              Real-time support demand intelligence across all 12 university care departments.
            </p>
          </div>

          {/* Prototype Demo Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSimulateSwap}
              className="btn-warm"
              style={{ fontSize: '13px', padding: '9px 18px' }}
              title="Simulates an appointment cancellation to trigger immediate waitlist swap"
            >
              <Sparkles size={14} />
              <span>Test Waitlist Swap</span>
            </button>

            <button
              onClick={handleReset}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#B8B3AA',
                border: 'none',
                outline: 'none',
                padding: '9px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 200ms ease'
              }}
            >
              <RotateCcw size={14} />
              <span>{resetSuccess ? "Reset Complete" : "Reset Demo Data"}</span>
            </button>
          </div>
        </div>

        {/* Swap Alert Feedback */}
        {swapAlert && (
          <div 
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(141, 207, 169, 0.15)',
              border: '1px solid rgba(141, 207, 169, 0.4)',
              color: '#FAF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              animation: 'fadeIn 200ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="#8DCFA9" />
              <div>
                <strong>Appointment Slot Freed & Dispatched!</strong>
                <div style={{ fontSize: '13px', color: '#B8B3AA' }}>
                  Waitlist engine detected slot cancellation and dispatched an earlier appointment offer to candidate Alex Rivera.
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('/journey')}
              className="btn-primary"
              style={{ fontSize: '12.5px', padding: '8px 16px' }}
            >
              <span>Verify in Journey</span>
            </button>
          </div>
        )}

        {/* High-Level Executive Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-panel" style={{ padding: '22px 24px', borderRadius: '20px', background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Supported</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#FAF8F5', marginTop: '4px' }}>4,280</div>
            <div style={{ fontSize: '12px', color: '#8DCFA9', marginTop: '4px' }}>↑ 18% term over term</div>
          </div>

          <div className="glass-panel" style={{ padding: '22px 24px', borderRadius: '20px', background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg Time to Relief</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#EBA756', marginTop: '4px' }}>1.4 hrs</div>
            <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '4px' }}>Down from 4.2 days</div>
          </div>

          <div className="glass-panel" style={{ padding: '22px 24px', borderRadius: '20px', background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Multi-Dept Cases</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#F4B6D7', marginTop: '4px' }}>64%</div>
            <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '4px' }}>2+ departments unified</div>
          </div>

          <div className="glass-panel" style={{ padding: '22px 24px', borderRadius: '20px', background: 'rgba(28, 27, 38, 0.75)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#78746C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Routing Confidence</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#8EDCF2', marginTop: '4px' }}>94.2%</div>
            <div style={{ fontSize: '12px', color: '#8DCFA9', marginTop: '4px' }}>Zero forced misroutes</div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem', paddingBottom: '12px' }}>
          {[
            { id: 'pulse', label: 'Campus Pulse (Aggregate Needs)' },
            { id: 'departments', label: '12 Department Grid & Workload' },
            { id: 'simulator', label: 'What-If Support Simulator' },
            { id: 'routing', label: 'AI Routing Architecture' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? '#FAF8F5' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? '#0B0B0E' : '#B8B3AA',
                transition: 'all 200ms ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Campus Pulse (Strictly Anonymized Aggregate Trends) */}
        {activeTab === 'pulse' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Left Card: Student Concern Distribution */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '32px 30px', 
                borderRadius: '24px', 
                background: 'rgba(24, 23, 34, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '11px', color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Anonymized Campus Intelligence
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 650, color: '#FAF8F5', marginTop: '2px' }}>
                  Dominant Student Pressures This Week
                </h3>
                <p style={{ fontSize: '13px', color: '#B8B3AA', marginTop: '4px' }}>
                  Aggregated from student messages with 100% PII stripping.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pulse.topConcerns?.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '6px' }}>
                      <span style={{ color: '#FAF8F5', fontWeight: 500 }}>{item.concern}</span>
                      <span style={{ color: '#EBA756', fontWeight: 600 }}>{item.percentage}% ({item.trend})</span>
                    </div>
                    {/* Dark Bar */}
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${item.percentage}%`, 
                          height: '100%', 
                          borderRadius: '4px', 
                          background: idx === 0 ? '#EBA756' : idx === 1 ? '#F4B6D7' : idx === 2 ? '#8DCFA9' : '#C7B8F5' 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Urgency Triage & Compound Support Graph */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '32px 30px', 
                borderRadius: '24px', 
                background: 'rgba(24, 23, 34, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#8DCFA9', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Care Urgency Triage
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 650, color: '#FAF8F5', marginTop: '2px', marginBottom: '1.25rem' }}>
                  Urgency Tier Distribution
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2rem' }}>
                  <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(141, 207, 169, 0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#8DCFA9' }}>58%</div>
                    <div style={{ fontSize: '12px', color: '#FAF8F5', fontWeight: 500, marginTop: '2px' }}>Green</div>
                    <div style={{ fontSize: '11px', color: '#78746C' }}>Exploration & Tools</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(235, 167, 86, 0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#EBA756' }}>37%</div>
                    <div style={{ fontSize: '12px', color: '#FAF8F5', fontWeight: 500, marginTop: '2px' }}>Amber</div>
                    <div style={{ fontSize: '11px', color: '#78746C' }}>Acute Pressures</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(248, 113, 113, 0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#F87171' }}>5%</div>
                    <div style={{ fontSize: '12px', color: '#FAF8F5', fontWeight: 500, marginTop: '2px' }}>Red</div>
                    <div style={{ fontSize: '11px', color: '#78746C' }}>Crisis Fast-Triage</div>
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5', marginBottom: '4px' }}>
                    Why Multi-Department Coordination Matters:
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#B8B3AA', lineHeight: 1.55 }}>
                    Before HERE, a student with exams, sleep deprivation, and tuition worries would have to fill 3 separate departmental intake forms and wait up to 2 weeks. HERE unified intake maps this simultaneously in 1.4 seconds.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#78746C' }}>
                <ShieldCheck size={14} color="#8DCFA9" />
                <span>Zero clinical diagnoses generated. Pure support operational matching.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 12 Department Workload Grid */}
        {activeTab === 'departments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {departments.map(dept => (
              <div 
                key={dept.id}
                className="glass-panel"
                style={{
                  padding: '24px 22px',
                  borderRadius: '20px',
                  background: 'rgba(24, 23, 34, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5' }}>
                    {dept.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#8DCFA9', background: 'rgba(141, 207, 169, 0.1)', padding: '2px 8px', borderRadius: '9999px' }}>
                    {dept.waitTime}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#B8B3AA', marginBottom: '14px' }}>
                  Lead: <strong style={{ color: '#FAF8F5' }}>{dept.lead}</strong>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#78746C', marginBottom: '4px' }}>
                    <span>Capacity Load</span>
                    <span>{dept.capacity}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${dept.capacity}%`, 
                        height: '100%', 
                        background: dept.capacity > 90 ? '#F87171' : dept.capacity > 75 ? '#EBA756' : '#8DCFA9' 
                      }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#78746C', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span>Active Cases: <strong style={{ color: '#FAF8F5' }}>{dept.activeCases}</strong></span>
                  <span style={{ color: '#EBA756' }}>● Optimal Flow</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: What-If Support Simulator */}
        {activeTab === 'simulator' && (
          <div 
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ maxWidth: '850px', marginBottom: '2.5rem' }}>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(235, 167, 86, 0.15)',
                  color: '#EBA756',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  marginBottom: '0.75rem'
                }}
              >
                <span>Simulation Sandbox · Does Not Alter Live Operations</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 650, color: '#FAF8F5', marginBottom: '8px' }}>
                Support Capacity & Demand Stress Simulator
              </h2>
              <p style={{ fontSize: '14.5px', color: '#B8B3AA', lineHeight: 1.6 }}>
                Simulate university campus shockwaves (e.g. flu season, midterm crisis surge, or counsellor leave) to evaluate systemic bottlenecks and automated mitigation strategies.
              </p>
            </div>

            {/* Slider Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>Staffing / Capacity Adjustment</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: capacityAdjustment < 0 ? '#F87171' : '#8DCFA9' }}>
                    {capacityAdjustment}%
                  </span>
                </div>
                <input 
                  type="range"
                  min="-40"
                  max="40"
                  value={capacityAdjustment}
                  onChange={(e) => setCapacityAdjustment(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ fontSize: '11.5px', color: '#78746C', marginTop: '6px' }}>
                  Simulates staff availability (e.g., -15% reduction in available appointments).
                </div>
              </div>

              <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>Student Request Surge (Midterm Season)</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#EBA756' }}>
                    +{demandShift}%
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="80"
                  value={demandShift}
                  onChange={(e) => setDemandShift(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ fontSize: '11.5px', color: '#78746C', marginTop: '6px' }}>
                  Simulates acute exam/finals anxiety influx across the university.
                </div>
              </div>
            </div>

            {/* Simulated Projected Impact */}
            <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(15, 20, 30, 0.7)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FAF8F5', marginBottom: '14px' }}>
                Simulated Operational Impact:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase' }}>Projected Waitlist Expansion</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#F87171', marginTop: '2px' }}>+{simulatedQueueIncrease}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase' }}>Est. Additional Wait Time</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#EBA756', marginTop: '2px' }}>+{simulatedWaitIncrease} hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#78746C', textTransform: 'uppercase' }}>Unassigned Priority Cases</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#FAF8F5', marginTop: '2px' }}>{Math.round(simulatedQueueIncrease * 0.4)}</div>
                </div>
              </div>
            </div>

            {/* Recommended Automated Mitigation Protocols */}
            <div>
              <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5', marginBottom: '10px' }}>
                HERE Automated Countermeasures:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(141, 207, 169, 0.08)', border: '1px solid rgba(141, 207, 169, 0.2)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#8DCFA9' }}>1. Dynamic Waitlist Swap Priority</div>
                  <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '3px' }}>Automatically re-allocates cancelled slots to high-urgency Amber cases.</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(244, 182, 215, 0.08)', border: '1px solid rgba(244, 182, 215, 0.2)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#F4B6D7' }}>2. Surface Bridge Audio Resets</div>
                  <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '3px' }}>Displays 5-minute NSDR & anxiety resets while students wait for consults.</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(235, 167, 86, 0.08)', border: '1px solid rgba(235, 167, 86, 0.2)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#EBA756' }}>3. Peer Listening Circle Handoff</div>
                  <div style={{ fontSize: '12px', color: '#B8B3AA', marginTop: '3px' }}>Offers verified 4th-year study mentor circles for non-clinical stress.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI Routing Architecture Explanation */}
        {activeTab === 'routing' && (
          <div 
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: '24px',
              background: 'rgba(24, 23, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ maxWidth: '850px', marginBottom: '2.5rem' }}>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(142, 220, 242, 0.15)',
                  color: '#8EDCF2',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  marginBottom: '0.75rem'
                }}
              >
                <span>Explainable AI Model Specification · Prototype Routing Engine</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 650, color: '#FAF8F5', marginBottom: '8px' }}>
                End-to-End NLP & Routing Architecture
              </h2>
              <p style={{ fontSize: '14.5px', color: '#B8B3AA', lineHeight: 1.6 }}>
                HERE does not replace human counsellors. It replaces confusing university directories by analyzing expressed student needs and formulating explainable, transparent care pathways.
              </p>
            </div>

            {/* Pipeline Flow Diagram in Dark Glass */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2.5rem' }}>
              {[
                {
                  step: '01',
                  name: 'Student Intake Layer (Text / Voice / Quick Actions)',
                  desc: 'Captures raw thoughts without requiring administrative terminology. Zero forced keyword matching.',
                  color: '#FAF8F5'
                },
                {
                  step: '02',
                  name: 'Safety Triage Filter (Zero-Delay Intercept)',
                  desc: 'Scans for critical self-harm or imminent danger. If detected, immediately surfaces 24/7 crisis hotlines and fast-triage human response.',
                  color: '#F87171'
                },
                {
                  step: '03',
                  name: 'NLP Entity & Multi-Theme Extraction',
                  desc: 'Extracts core themes (Academic pressure, sleep disturbance, financial hardship) across the 12 university departments.',
                  color: '#EBA756'
                },
                {
                  step: '04',
                  name: 'Urgency Classification (GREEN / AMBER / RED)',
                  desc: 'Calibrates operational routing urgency. Explicitly labeled: "Support recommendation, not a medical diagnosis."',
                  color: '#F4B6D7'
                },
                {
                  step: '05',
                  name: 'Support Graph Routing & Multi-Department Plan',
                  desc: 'Coordinates multiple relevant departments simultaneously (e.g. Tutoring + Wellbeing + Emergency Aid).',
                  color: '#8DCFA9'
                },
                {
                  step: '06',
                  name: 'AI Mirror & Student Consent Confirmation',
                  desc: 'Reflects understanding back to student. Student can edit, modify, or approve summary handoff to staff.',
                  color: '#8EDCF2'
                }
              ].map((pipe, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    padding: '18px 22px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: pipe.color, width: '32px' }}>
                    {pipe.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#FAF8F5' }}>
                      {pipe.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#B8B3AA', marginTop: '3px', lineHeight: 1.5 }}>
                      {pipe.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ServiceNow Enterprise Integration Note */}
            <div style={{ padding: '20px 24px', borderRadius: '18px', background: 'rgba(142, 220, 242, 0.06)', border: '1px solid rgba(142, 220, 242, 0.2)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#8EDCF2', marginBottom: '4px' }}>
                ServiceNow Enterprise Architecture Alignment:
              </div>
              <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.6 }}>
                HERE Frontend seamlessly maps to ServiceNow Case & Knowledge Management (CSM), ServiceNow Flow Designer (for multi-department assignment), and Performance Analytics. The NLP abstraction layer can be backed by ServiceNow Virtual Agent / NLU in production environments.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
