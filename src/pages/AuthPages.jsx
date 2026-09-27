import React, { useState } from 'react';
import { Mail, Key, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Info, Sparkles, User, GraduationCap, Building } from 'lucide-react';
import { AssistantOrb } from '../components/AssistantOrb';
import { signIn, signUp, sendPasswordReset, DEMO_ACCOUNTS } from '../services/authService';

export function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn(email, password);
      setLoading(false);
      if (res.success && res.user) {
        // Automatic Role-Based Redirect (No user selection)
        if (res.user.role === 'COUNSELLOR') {
          onNavigate('/counsellor');
        } else if (res.user.role === 'ADMIN') {
          onNavigate('/admin');
        } else {
          onNavigate('/journey');
        }
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleFillDemo = (demoEmail) => {
    const account = DEMO_ACCOUNTS[demoEmail];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setError('');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    const res = await sendPasswordReset(resetEmail);
    setResetLoading(false);
    setResetSuccess(res.message);
  };

  return (
    <div 
      style={{ 
        paddingTop: '110px', 
        minHeight: '100vh', 
        backgroundColor: '#07070A', 
        paddingBottom: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Cinematic Ambient Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 182, 215, 0.08) 0%, rgba(235, 167, 86, 0.03) 45%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '460px', width: '100%', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <AssistantOrb size={60} state="idle" />
          </div>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#B8B3AA',
              fontSize: '12px',
              marginBottom: '10px'
            }}
          >
            <ShieldCheck size={14} color="#8DCFA9" />
            <span>FERPA Compliant University Access</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 650, color: '#FAF8F5', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Sign in to HERE
          </h1>
          <p style={{ fontSize: '14.5px', color: '#B8B3AA', lineHeight: 1.5 }}>
            Single unified sanctuary for student care, counseling, and academic wellbeing.
          </p>
        </div>

        {/* Authentication Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '34px 30px', 
            borderRadius: '24px',
            background: 'rgba(22, 21, 30, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
          }}
        >
          {error && (
            <div 
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* University Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>
                University Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '14px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 200ms ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(244, 182, 215, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <Mail size={16} color="#78746C" style={{ position: 'absolute', top: '15px', left: '15px' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#CBD5E1' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#F4B6D7',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '14px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 200ms ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(244, 182, 215, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <Key size={16} color="#78746C" style={{ position: 'absolute', top: '15px', left: '15px' }} />
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '12px',
                fontSize: '14.5px',
                fontWeight: 650,
                marginBottom: '1.25rem' 
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign in'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Create Account Link */}
          <div style={{ textAlign: 'center', fontSize: '13.5px', color: '#B8B3AA' }}>
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              style={{ 
                background: 'none', 
                border: 'none', 
                outline: 'none', 
                color: '#F4B6D7', 
                cursor: 'pointer', 
                fontWeight: 600 
              }}
            >
              Create account
            </button>
          </div>

          {/* Evaluator Prototype Demo Credentials Section */}
          <div 
            style={{ 
              marginTop: '1.75rem', 
              paddingTop: '1.25rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#EBA756', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Demo Accounts · Quick Fill
              </span>
              <span style={{ fontSize: '11px', color: '#78746C' }}>
                Prototype Only
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('student@here.demo')}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  background: 'rgba(244, 182, 215, 0.08)',
                  border: 'none',
                  outline: 'none',
                  color: '#F4B6D7',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background 150ms ease'
                }}
                title="Aarav Sharma · Student Demo (student@here.demo)"
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('counsellor@here.demo')}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  background: 'rgba(142, 220, 242, 0.08)',
                  border: 'none',
                  outline: 'none',
                  color: '#8EDCF2',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background 150ms ease'
                }}
                title="Dr. Sarah Jenkins · Counsellor Demo (counsellor@here.demo)"
              >
                Counsellor
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin@here.demo')}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  background: 'rgba(235, 167, 86, 0.08)',
                  border: 'none',
                  outline: 'none',
                  color: '#EBA756',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background 150ms ease'
                }}
                title="Elena Rostova · Admin Operations Demo (admin@here.demo)"
              >
                Admin
              </button>
            </div>
            <div style={{ fontSize: '10.5px', color: '#78746C', textAlign: 'center', marginTop: '8px' }}>
              Password: <code style={{ color: '#CBD5E1' }}>HEREdemo123</code> · Click any pill to fill
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            backgroundColor: 'rgba(7, 7, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div 
            style={{
              maxWidth: '440px',
              width: '100%',
              background: '#16151E',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 650, color: '#FAF8F5', marginBottom: '8px' }}>
              Reset University Password
            </h3>
            <p style={{ fontSize: '13.5px', color: '#B8B3AA', lineHeight: 1.5, marginBottom: '20px' }}>
              Enter your registered university email to receive private reset instructions.
            </p>

            {resetSuccess ? (
              <div>
                <div 
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(141, 207, 169, 0.12)',
                    border: '1px solid rgba(141, 207, 169, 0.3)',
                    color: '#8DCFA9',
                    fontSize: '13px',
                    marginBottom: '16px'
                  }}
                >
                  ✓ {resetSuccess}
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Return to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#CBD5E1', marginBottom: '6px' }}>
                    University Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="student@here.demo"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(12, 12, 16, 0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{ background: 'transparent', border: 'none', color: '#B8B3AA', cursor: 'pointer', fontSize: '13.5px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="btn-primary"
                    style={{ fontSize: '13.5px', padding: '9px 18px' }}
                  >
                    <span>{resetLoading ? 'Sending...' : 'Send reset link'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SignupPage({ onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year Undergraduate');
  const [department, setDepartment] = useState('School of Computer Science & Engineering');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Normal public registration always creates a STUDENT account (no role prompt)
      const res = await signUp({
        name: fullName,
        email,
        password,
        year: yearOfStudy,
        department
      });

      setLoading(false);

      if (res.success && res.user) {
        // Redirect to student sanctuary journey
        onNavigate('/journey');
      } else {
        setError(res.error || 'Failed to create student account.');
      }
    } catch (err) {
      setLoading(false);
      setError('Registration error. Please try again.');
    }
  };

  return (
    <div 
      style={{ 
        paddingTop: '110px', 
        minHeight: '100vh', 
        backgroundColor: '#07070A', 
        paddingBottom: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Radial Accent */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 182, 215, 0.08) 0%, rgba(141, 207, 169, 0.03) 45%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '480px', width: '100%', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <AssistantOrb size={60} state="idle" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 650, color: '#FAF8F5', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Create Student Account
          </h1>
          <p style={{ fontSize: '14.5px', color: '#B8B3AA', lineHeight: 1.5 }}>
            Access confidential university wellbeing, counseling, and exam advocacy.
          </p>
        </div>

        {/* Signup Form Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '34px 30px', 
            borderRadius: '24px',
            background: 'rgba(22, 21, 30, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
          }}
        >
          {error && (
            <div 
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '14px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <User size={16} color="#78746C" style={{ position: 'absolute', top: '15px', left: '15px' }} />
              </div>
            </div>

            {/* University Email */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>
                University Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '14px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <Mail size={16} color="#78746C" style={{ position: 'absolute', top: '15px', left: '15px' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '14px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <Key size={16} color="#78746C" style={{ position: 'absolute', top: '15px', left: '15px' }} />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '14px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <Key size={16} color="#78746C" style={{ position: 'absolute', top: '15px', left: '15px' }} />
              </div>
            </div>

            {/* Optional Fields: Year and Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                  Year of Study <span style={{ opacity: 0.6 }}>(Optional)</span>
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="1st Year Undergraduate">1st Year Undergraduate</option>
                  <option value="2nd Year Undergraduate">2nd Year Undergraduate</option>
                  <option value="3rd Year Undergraduate">3rd Year Undergraduate</option>
                  <option value="Final Year / Honours">Final Year / Honours</option>
                  <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                  Faculty / Dept <span style={{ opacity: 0.6 }}>(Optional)</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(12, 12, 16, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#FAF8F5',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="School of Computer Science & Engineering">Computer Science & Eng</option>
                  <option value="Faculty of Arts & Humanities">Arts & Humanities</option>
                  <option value="School of Business & Finance">Business & Economics</option>
                  <option value="Faculty of Science & Health">Science & Health</option>
                  <option value="School of Law & Social Justice">Law & Social Sciences</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '12px',
                fontSize: '14.5px',
                fontWeight: 650,
                marginBottom: '1.25rem' 
              }}
            >
              <span>{loading ? 'Creating Account...' : 'Create account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Already have an account */}
          <div style={{ textAlign: 'center', fontSize: '13.5px', color: '#B8B3AA' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              style={{ 
                background: 'none', 
                border: 'none', 
                outline: 'none', 
                color: '#F4B6D7', 
                cursor: 'pointer', 
                fontWeight: 600 
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
