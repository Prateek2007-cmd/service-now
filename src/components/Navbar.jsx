import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  Sparkles, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  Cpu, 
  Check, 
  CheckCircle2, 
  Clock,
  User,
  LogOut,
  Settings,
  Calendar,
  Compass
} from 'lucide-react';
import { 
  getStore, 
  subscribeStore, 
  acceptWaitlistOffer, 
  declineWaitlistOffer, 
  markNotificationRead 
} from '../services/store';
import { getCurrentUser, subscribeAuth, signOut } from '../services/authService';

export default function Navbar({ currentRoute = '/', onNavigate, onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeState, setStoreState] = useState(getStore());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const langRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    return subscribeStore((updated) => {
      setStoreState({ ...updated });
    });
  }, []);

  useEffect(() => {
    return subscribeAuth((user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = (currentUser?.role || storeState.currentRole || 'STUDENT').toUpperCase();
  const notifications = storeState.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'How it works', route: '/how-it-works' },
    { label: 'Support', route: '/support' },
    { label: 'My Journey', route: '/journey' },
    { label: 'Appointments', route: '/appointments' },
    { label: 'Resources', route: '/resources' },
  ];

  // If in counsellor or admin mode, dynamically provide portal link
  if (role === 'COUNSELLOR') {
    navLinks.push({ label: 'Counsellor Portal', route: '/counsellor', highlight: true });
  } else if (role === 'ADMIN') {
    navLinks.push({ label: 'Admin Cockpit', route: '/admin', highlight: true });
  }

  const handleNavClick = (route) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setProfileDropdown(false);
    onNavigate('/login');
  };

  const handleAcceptOffer = (notifId) => {
    acceptWaitlistOffer(notifId);
    setNotifDropdown(false);
    onNavigate('/journey');
  };

  const handleDeclineOffer = (notifId) => {
    declineWaitlistOffer(notifId);
  };

  return (
    <header 
      className={`glass-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        padding: scrolled ? '14px clamp(1.5rem, 5vw, 4.5rem)' : '24px clamp(1.5rem, 5vw, 4.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Brand Logo */}
      <div 
        onClick={() => handleNavClick('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Circular ring logo */}
          <span 
            style={{
              position: 'relative',
              display: 'block',
              width: '19px',
              height: '19px',
              borderRadius: '50%',
              border: '2px solid rgba(250, 248, 245, 0.95)',
              borderRightColor: '#F4B6D7',
            }}
          />
        </div>
        <span 
          style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#FAF8F5',
            fontFamily: 'var(--font-display)',
          }}
        >
          HERE
        </span>
      </div>

      {/* Center Navigation Links */}
      <nav 
        className="desktop-nav-links"
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '2.5rem',
        }}
      >
        {navLinks.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.route)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: item.highlight ? '#EBA756' : isActive ? '#FAF8F5' : '#B8B3AA',
                fontSize: '14.5px',
                fontWeight: isActive || item.highlight ? 600 : 400,
                cursor: 'pointer',
                padding: '8px 2px',
                position: 'relative',
                transition: 'color 200ms ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF8F5')}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = item.highlight ? '#EBA756' : '#B8B3AA';
              }}
            >
              {item.label}
              {isActive && (
                <span 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#FAF8F5',
                    borderRadius: '2px',
                  }} 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Responsive visibility styling */}
      <style>{`
        @media (min-width: 960px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 959px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .desktop-only-controls {
            display: none !important;
          }
        }
      `}</style>

      {/* Right Controls - Clean minimalist */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Search icon button */}
        <button
          onClick={() => (onOpenSearch ? onOpenSearch() : handleNavClick('/resources'))}
          aria-label="Search"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#B8B3AA',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF8F5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#B8B3AA')}
          title="Search support, guides, and resources (Ctrl+K)"
        >
          <Search size={18} />
        </button>

        {/* Interactive Notifications Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifDropdown(!notifDropdown)}
            aria-label="Notifications"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: unreadCount > 0 ? '#FAF8F5' : '#B8B3AA',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'color 200ms ease',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EBA756',
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifDropdown && (
            <div 
              className="glass-dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 14px)',
                right: '-20px',
                width: '340px',
                padding: '16px',
                zIndex: 150,
                maxHeight: '440px',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#78746C' }}>{unreadCount} unread</span>
              </div>

              {notifications.length === 0 ? (
                <div style={{ fontSize: '12.5px', color: '#78746C', textAlign: 'center', padding: '20px 0' }}>
                  No notifications yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: n.type === 'waitlist_offer' ? 'rgba(235, 167, 86, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        border: n.type === 'waitlist_offer' ? '1px solid rgba(235, 167, 86, 0.3)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: n.type === 'waitlist_offer' ? '#EBA756' : '#FAF8F5' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#78746C' }}>{n.timestamp}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#B8B3AA', lineHeight: 1.45, marginBottom: n.type === 'waitlist_offer' ? '10px' : '4px' }}>
                        {n.message}
                      </p>

                      {/* Waitlist Swap Actions if Offer */}
                      {n.type === 'waitlist_offer' && !n.accepted && !n.declined && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={() => handleAcceptOffer(n.id)}
                            className="btn-warm"
                            style={{ fontSize: '11.5px', padding: '6px 12px' }}
                          >
                            <span>Accept Earlier Slot</span>
                          </button>
                          <button
                            onClick={() => handleDeclineOffer(n.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#78746C',
                              fontSize: '11.5px',
                              cursor: 'pointer'
                            }}
                          >
                            Keep current
                          </button>
                        </div>
                      )}

                      {n.accepted && (
                        <div style={{ fontSize: '11px', color: '#8DCFA9', marginTop: '4px', fontWeight: 500 }}>
                          ✓ Earlier slot accepted and journey updated!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar / Authentication Menu */}
        {currentUser ? (
          <div ref={profileRef} style={{ position: 'relative' }} className="desktop-only-controls">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 4px',
                borderRadius: '9999px',
                transition: 'background 200ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
              title={`${currentUser.name} (${currentUser.role})`}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: currentUser.avatarColor || '#F4B6D7',
                  color: '#0B0B0E',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {currentUser.avatarInitials || 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#FAF8F5' }}>
                {currentUser.name?.split(' ')[0]}
              </span>
              <ChevronDown size={12} style={{ opacity: 0.6, color: '#B8B3AA' }} />
            </button>

            {profileDropdown && (
              <div 
                className="glass-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  padding: '12px',
                  minWidth: '220px',
                  zIndex: 110,
                }}
              >
                {/* User info card */}
                <div style={{ padding: '6px 8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>
                      {currentUser.name}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: 650, 
                        padding: '2px 8px', 
                        borderRadius: '9999px', 
                        background: role === 'COUNSELLOR' ? 'rgba(142, 220, 242, 0.15)' : role === 'ADMIN' ? 'rgba(235, 167, 86, 0.15)' : 'rgba(244, 182, 215, 0.15)',
                        color: role === 'COUNSELLOR' ? '#8EDCF2' : role === 'ADMIN' ? '#EBA756' : '#F4B6D7',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#78746C' }}>
                    {currentUser.email}
                  </div>
                </div>

                {/* Profile Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => { setProfileDropdown(false); onNavigate('/profile'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: '#FAF8F5',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <User size={14} color="#B8B3AA" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => { setProfileDropdown(false); onNavigate('/journey'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: '#FAF8F5',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Compass size={14} color="#B8B3AA" />
                    <span>My Journey</span>
                  </button>

                  <button
                    onClick={() => { setProfileDropdown(false); onNavigate('/appointments'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: '#FAF8F5',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Calendar size={14} color="#B8B3AA" />
                    <span>Appointments</span>
                  </button>

                  <button
                    onClick={() => { setProfileDropdown(false); onNavigate('/settings'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: '#FAF8F5',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings size={14} color="#B8B3AA" />
                    <span>Settings</span>
                  </button>

                  {role === 'COUNSELLOR' && (
                    <button
                      onClick={() => { setProfileDropdown(false); onNavigate('/counsellor'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        fontSize: '13px',
                        color: '#8EDCF2',
                        background: 'rgba(142, 220, 242, 0.08)',
                        border: 'none',
                        outline: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <UserCheck size={14} color="#8EDCF2" />
                      <span>Counsellor Portal</span>
                    </button>
                  )}

                  {role === 'ADMIN' && (
                    <button
                      onClick={() => { setProfileDropdown(false); onNavigate('/admin'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        fontSize: '13px',
                        color: '#EBA756',
                        background: 'rgba(235, 167, 86, 0.08)',
                        border: 'none',
                        outline: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Cpu size={14} color="#EBA756" />
                      <span>Admin Cockpit</span>
                    </button>
                  )}
                </div>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '8px 0' }} />

                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '13px',
                    color: '#FCA5A5',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={14} color="#FCA5A5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('/login')}
            className="desktop-only-controls"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              outline: 'none',
              color: '#FAF8F5',
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
          >
            Sign in
          </button>
        )}

        {/* Language selector */}
        <div ref={langRef} style={{ position: 'relative' }} className="desktop-only-controls">
          <button
            onClick={() => setLangDropdown(!langDropdown)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#B8B3AA',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 4px',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF8F5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8B3AA')}
          >
            <span>{selectedLang}</span>
            <ChevronDown 
              size={13} 
              style={{
                transform: langDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease',
              }} 
            />
          </button>

          {langDropdown && (
            <div 
              className="glass-dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                padding: '8px',
                minWidth: '120px',
                zIndex: 110,
              }}
            >
              {[
                { code: 'EN', name: 'English' },
                { code: 'ES', name: 'Español' },
                { code: 'FR', name: 'Français' },
                { code: 'ZH', name: '中文' },
                { code: 'HI', name: 'हिन्दी' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setLangDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: selectedLang === lang.code ? 600 : 400,
                    color: selectedLang === lang.code ? '#F4B6D7' : '#B8B3AA',
                    background: selectedLang === lang.code ? 'rgba(244, 182, 215, 0.12)' : 'transparent',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <span>{lang.name}</span>
                  <span style={{ fontSize: '11px', opacity: 0.6 }}>{lang.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={() => handleNavClick(currentUser ? '/chat' : '/login')}
          style={{
            background: '#F4B6D7',
            color: '#161219',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 22px',
            borderRadius: '9999px',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 200ms ease',
          }}
          className="desktop-only-controls"
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F8CADF')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F4B6D7')}
        >
          <span>Start privately</span>
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#B8B3AA',
            cursor: 'pointer',
            padding: '8px',
            display: 'none',
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="glass-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: '16px',
            right: '16px',
            padding: '16px',
            zIndex: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.route)}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: isActive ? '#FAF8F5' : '#B8B3AA',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F4B6D7' }} />
                )}
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '6px 0' }} />

          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '6px 12px', fontSize: '13px', color: '#B8B3AA' }}>
                Signed in as <strong style={{ color: '#FAF8F5' }}>{currentUser.name}</strong> ({currentUser.role})
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#FCA5A5',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/login')}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FAF8F5',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign in
            </button>
          )}

          <button
            onClick={() => handleNavClick(currentUser ? '/chat' : '/login')}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '14px',
              background: '#F4B6D7',
              color: '#161219',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px'
            }}
          >
            <span>Start privately</span>
          </button>
        </div>
      )}
    </header>
  );
}
