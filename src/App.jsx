import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HowItWorksSection from './components/HowItWorksSection';
import SupportGrid from './components/SupportGrid';
import ChatInterface from './components/ChatInterface';
import MyJourneyView from './components/MyJourneyView';
import StoriesSection from './components/StoriesSection';
import ResourcesSection from './components/ResourcesSection';
import CounsellingPage from './pages/CounsellingPage';
import QuietBuddyPage from './pages/QuietBuddyPage';
import BuddyPortalPage from './pages/BuddyPortalPage';
import { getBuddySession, subscribeBuddyAccounts } from './services/buddyAccountService';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import CounsellorPortalPage from './pages/CounsellorPortalPage';
import AdminPortalPage from './pages/AdminPortalPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import NotFoundPage from './pages/NotFoundPage';
import FooterCTA from './components/FooterCTA';
import { Search, X, ShieldAlert } from 'lucide-react';
import { signOut } from './services/authService';
import { getCurrentUser, subscribeAuth } from './services/authService';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname || '/');
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [chatInitialDept, setChatInitialDept] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // A signed-in Quiet Buddy is a separate identity that must never reach any
  // student-owned route. getCurrentUser() auto-seeds a demo student on a fresh
  // browser, so the existing !currentUser guards are NOT sufficient on their own.
  const [buddySession, setBuddySession] = useState(() => getBuddySession());

  useEffect(() => subscribeBuddyAccounts(() => setBuddySession(getBuddySession())), []);

  const STUDENT_ONLY_ROUTES = [
    '/chat',
    '/journey',
    '/student',
    '/appointments',
    '/profile',
    '/settings',
    '/counsellor',
    '/admin',
    '/admin/routing',
    '/quiet-buddy',
  ];

  const buddyBlocked = !!buddySession && STUDENT_ONLY_ROUTES.includes(route);

  // ESC closes the search modal, Ctrl/Cmd+K toggles it from anywhere
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((open) => {
          if (open) setSearchQuery('');
          return !open;
        });
        return;
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchModalOpen]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // `options.prompt` seeds the chat so a student arriving from a resource guide
  // does not have to re-explain what they were just reading about.
  const navigate = (newRoute, options = {}) => {
    if (options.prompt !== undefined) {
      setChatInitialPrompt(options.prompt);
      setChatInitialDept(options.dept ?? null);
    }
    window.history.pushState({}, '', newRoute);
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChatWithPrompt = (promptText) => {
    setChatInitialPrompt(promptText);
    navigate('/chat');
  };

  const handleSelectDepartment = (deptName) => {
    setChatInitialDept(deptName);
    navigate('/chat');
  };

  const searchableItems = [
    { title: 'Quiet Buddy', desc: 'Nominate someone to walk with you through support', route: '/quiet-buddy' },
    { title: 'Anonymous Story Wall', desc: 'Read and share unedited student experiences', route: '/stories' },
    { title: 'Academic Support & Tutoring', desc: 'Study guidance, tutoring, exam resources', route: '/support' },
    { title: 'Counseling & Wellbeing Services', desc: 'Mental health, anxiety mitigation, licensed counselors', route: '/counselling' },
    { title: 'Financial Hardship Grants', desc: 'Emergency bursaries, fee support, tuition aid', route: '/support' },
    { title: 'Exam Anxiety De-escalation', desc: 'Practical grounding techniques for exam stress', route: '/resources' },
    { title: 'Book an Appointment', desc: 'Schedule a session with university advisors', route: '/appointments' },
    { title: 'My Support Journey Timeline', desc: 'Track ongoing support requests and waitlist state', route: '/journey' },
    { title: 'Counsellor Staff Portal', desc: 'Case management, approved summaries, consultation notes', route: '/counsellor' },
    { title: 'Admin Operational Cockpit', desc: 'Campus Pulse, What-If simulator, routing monitor', route: '/admin' },
    { title: 'Privacy & FERPA Guidelines', desc: 'How HERE secures your academic & health data', route: '/privacy' },
    { title: 'Crisis & Safety Guidelines', desc: '24/7 numbers and what to do right now', route: '/help' },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableItems.slice(0, 4);

  // Render appropriate view based on route
  const renderCurrentRoute = () => {
    // Hard stop: a Quiet Buddy session may only ever see the public site and its
    // own portal. Checked before anything else so no route can leak by omission.
    if (buddyBlocked) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(28,27,38,0.9)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <ShieldAlert size={34} color="#C7B8F5" style={{ marginBottom: '14px' }} />
            <h2 style={{ fontSize: '23px', color: '#FAF8F5', marginBottom: '12px' }}>That page isn't available to a Quiet Buddy</h2>
            <p style={{ fontSize: '14px', color: '#B8B3AA', lineHeight: 1.6, marginBottom: '24px' }}>
              A buddy account only shows the person you are helping — never their case, notes, or any other student's
              information. That's the whole point of the role.
            </p>
            <button onClick={() => navigate('/buddy-portal')} className="btn-primary">
              Go to your portal →
            </button>
          </div>
        </div>
      );
    }

    switch (route) {
      case '/':
        return <HomePage onNavigate={navigate} onStartChat={handleStartChatWithPrompt} />;
      
      case '/how-it-works':
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-darker)' }}>
            <HowItWorksSection onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </div>
        );

      case '/support':
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-deep)' }}>
            <SupportGrid onNavigate={navigate} onSelectDepartment={handleSelectDepartment} />
            <FooterCTA onNavigate={navigate} />
          </div>
        );

      case '/chat':
        if (!currentUser) return <LoginPage onNavigate={navigate} />;
        return (
          <ChatInterface 
            initialPrompt={chatInitialPrompt} 
            initialDept={chatInitialDept}
            onNavigate={navigate} 
          />
        );

      case '/student':
        if (!currentUser) return <LoginPage onNavigate={navigate} />;
        if (currentUser.role === 'COUNSELLOR') {
          return (
            <>
              <CounsellorPortalPage onNavigate={navigate} />
              <FooterCTA onNavigate={navigate} />
            </>
          );
        }
        if (currentUser.role === 'ADMIN') {
          return (
            <>
              <AdminPortalPage onNavigate={navigate} />
              <FooterCTA onNavigate={navigate} />
            </>
          );
        }
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-deep)' }}>
            <MyJourneyView onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </div>
        );

      case '/stories':
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-darker)' }}>
            <StoriesSection onNavigate={navigate} onStartChat={handleStartChatWithPrompt} />
            <FooterCTA onNavigate={navigate} />
          </div>
        );

      case '/resources':
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-deep)' }}>
            <ResourcesSection onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </div>
        );

      case '/buddy-portal':
        // Rendered without the student Navbar: a buddy has no business in the
        // student navigation, and the nav links student surfaces.
        return <BuddyPortalPage onNavigate={navigate} />;

      case '/quiet-buddy':
        return <QuietBuddyPage onNavigate={navigate} />;

      case '/counselling':
        return (
          <>
            <CounsellingPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/appointments':
        if (!currentUser) return <LoginPage onNavigate={navigate} />;
        return (
          <>
            <AppointmentsPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/journey':
        if (!currentUser) return <LoginPage onNavigate={navigate} />;
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-deep)' }}>
            <MyJourneyView onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </div>
        );

      case '/profile':
        if (!currentUser) return <LoginPage onNavigate={navigate} />;
        return (
          <>
            <ProfilePage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/settings':
        if (!currentUser) return <LoginPage onNavigate={navigate} />;
        return (
          <>
            <SettingsPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/about':
        return (
          <>
            <AboutPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/help':
        return (
          <>
            <HelpPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/privacy':
        return (
          <>
            <PrivacyPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/counsellor':
        if (!currentUser) {
          return <LoginPage onNavigate={navigate} />;
        }
        if (currentUser.role !== 'COUNSELLOR') {
          return (
            <div style={{ paddingTop: '140px', minHeight: '80vh', textAlign: 'center', padding: '140px 20px 60px' }}>
              <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(28,27,38,0.85)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <ShieldAlert size={36} color="#F4B6D7" style={{ marginBottom: '14px' }} />
                <h2 style={{ fontSize: '24px', color: '#FAF8F5', marginBottom: '12px' }}>Staff Access Restricted</h2>
                <p style={{ fontSize: '14px', color: '#B8B3AA', lineHeight: 1.6, marginBottom: '24px' }}>
                  The Counsellor Sanctuary Cockpit is restricted to authorized clinical wellbeing staff. You are signed in as <strong style={{ color: '#FAF8F5' }}>{currentUser.name}</strong> ({currentUser.role}).
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate(currentUser.role === 'ADMIN' ? '/admin' : '/journey')} className="btn-primary">
                    Go to your authorized portal →
                  </button>
                  {/* Without this the page is a dead end: a student who landed here
                      has no way to reach the sign-in screen for a staff account. */}
                  <button
                    onClick={() => { signOut(); navigate('/login'); }}
                    className="btn-secondary"
                  >
                    Sign in as staff
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <>
            <CounsellorPortalPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/admin':
      case '/admin/routing':
        if (!currentUser) {
          return <LoginPage onNavigate={navigate} />;
        }
        if (currentUser.role !== 'ADMIN') {
          return (
            <div style={{ paddingTop: '140px', minHeight: '80vh', textAlign: 'center', padding: '140px 20px 60px' }}>
              <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(28,27,38,0.85)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <ShieldAlert size={36} color="#EBA756" style={{ marginBottom: '14px' }} />
                <h2 style={{ fontSize: '24px', color: '#FAF8F5', marginBottom: '12px' }}>Administrative Access Restricted</h2>
                <p style={{ fontSize: '14px', color: '#B8B3AA', lineHeight: 1.6, marginBottom: '24px' }}>
                  The Unified Operations Cockpit is restricted to university department leadership. You are signed in as <strong style={{ color: '#FAF8F5' }}>{currentUser.name}</strong> ({currentUser.role}).
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate(currentUser.role === 'COUNSELLOR' ? '/counsellor' : '/journey')} className="btn-primary">
                    Go to your authorized portal →
                  </button>
                  <button
                    onClick={() => { signOut(); navigate('/login'); }}
                    className="btn-secondary"
                  >
                    Sign in as staff
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <>
            <AdminPortalPage onNavigate={navigate} />
            <FooterCTA onNavigate={navigate} />
          </>
        );

      case '/login':
        return <LoginPage onNavigate={navigate} />;

      case '/signup':
        return <SignupPage onNavigate={navigate} />;

      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)', color: 'var(--text-primary)' }}>
      {/* Global Navigation Bar */}
      {/* Student navigation is withheld from a Quiet Buddy session. */}
      {!buddySession && (
        <Navbar 
          currentRoute={route} 
          onNavigate={navigate} 
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      {/* Main View */}
      {renderCurrentRoute()}

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '120px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
          onClick={() => {
            setSearchModalOpen(false);
            setSearchQuery('');
          }}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '620px',
              width: '100%',
              background: '#16151E',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                gap: '12px',
              }}
            >
              <Search size={18} color="#8EDCF2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments, resources, or services..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F5F4F2',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  setSearchQuery('');
                }}
                style={{ background: 'none', border: 'none', color: '#9BA4B5', cursor: 'pointer' }}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div style={{ padding: '12px 14px', maxHeight: '360px', overflowY: 'auto' }}>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px' }}>
                {searchQuery.trim() ? `${filteredSearch.length} result${filteredSearch.length === 1 ? '' : 's'}` : 'Quick Matches'}
              </div>
              {filteredSearch.length === 0 && (
                <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#F5F4F2', marginBottom: '6px' }}>Nothing matched “{searchQuery.trim()}”</div>
                  <div style={{ fontSize: '12.5px', color: '#78746C', marginBottom: '16px' }}>
                    Try a plainer word like “money”, “sleep”, or “exam”.
                  </div>
                  <button
                    onClick={() => {
                      setSearchModalOpen(false);
                      setSearchQuery('');
                      navigate('/support');
                    }}
                    className="btn-primary"
                    style={{ fontSize: '13px', padding: '9px 20px' }}
                  >
                    <span>Browse every department</span>
                  </button>
                </div>
              )}
              {filteredSearch.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchModalOpen(false);
                    setSearchQuery('');
                    navigate(item.route);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#F5F4F2' }}>{item.title}</div>
                  <div style={{ fontSize: '12.5px', color: '#9BA4B5' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '10px 18px', background: 'rgba(5, 8, 15, 0.5)', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
              <span>ESC to close · Ctrl+K to reopen</span>
              <span>Every Department, One Front Door</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
