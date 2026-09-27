// Authentication Service for HERE Student Support Platform
// Centralized authenticated user state with role-based routing and seeded demo accounts

const AUTH_STORAGE_KEY = 'HERE_AUTH_USER_V1';

// Seeded Prototype Demo Accounts (Single Source of Truth)
export const DEMO_ACCOUNTS = {
  'student@here.demo': {
    id: 'STU-88219',
    name: 'Aarav Sharma',
    email: 'student@here.demo',
    password: 'HEREdemo123',
    role: 'STUDENT',
    department: 'School of Computer Science & Engineering',
    year: '3rd Year Undergraduate',
    avatarInitials: 'AS',
    avatarColor: '#F4B6D7',
    preferences: {
      modality: 'Confidential 1-on-1',
      shareSummaryWithAdvisor: true,
      allowUrgentHandoff: true
    }
  },
  'counsellor@here.demo': {
    id: 'CNS-001',
    name: 'Dr. Sarah Jenkins',
    email: 'counsellor@here.demo',
    password: 'HEREdemo123',
    role: 'COUNSELLOR',
    department: 'Counselling & Mental Wellbeing',
    title: 'Senior Clinical Wellbeing Lead',
    avatarInitials: 'SJ',
    avatarColor: '#8EDCF2',
    preferences: {
      office: 'Sanctuary Suite 204',
      acceptsUrgentTriage: true
    }
  },
  'admin@here.demo': {
    id: 'admin@here.demo',
    name: 'Elena Rostova',
    email: 'admin@here.demo',
    password: 'HEREdemo123',
    role: 'ADMIN',
    department: 'University Student Care Operations',
    title: 'Director of Unified Support & Multi-Department Routing',
    avatarInitials: 'ER',
    avatarColor: '#EBA756',
    preferences: {
      notifyOnAmberSurge: true
    }
  }
};

import { setCurrentAuthUser } from './store.js';

let currentUser = null;
let initialized = false;
const authListeners = new Set();

export function getCurrentUser() {
  if (currentUser !== null) return currentUser;

  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored && stored !== 'null') {
        currentUser = JSON.parse(stored);
        return currentUser;
      }
    }
  } catch (e) {
    console.error('Error reading auth state:', e);
  }

  // If first time ever opening without stored state, check if initialized
  if (!initialized) {
    initialized = true;
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === null) {
        // First fresh visit: seed student demo for immediate usability
        currentUser = { ...DEMO_ACCOUNTS['student@here.demo'] };
        saveAuthUser(currentUser);
        return currentUser;
      }
    } else {
      currentUser = { ...DEMO_ACCOUNTS['student@here.demo'] };
      return currentUser;
    }
  }

  return null;
}

function saveAuthUser(user) {
  currentUser = user;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, 'null');
    }
  } catch (e) {
    console.error('Error saving auth user:', e);
  }
  try {
    setCurrentAuthUser(user);
  } catch (e) {
    console.error('Error syncing store auth user:', e);
  }
  notifyAuthListeners();
}

export function subscribeAuth(listener) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function notifyAuthListeners() {
  for (const listener of authListeners) {
    try {
      listener(currentUser);
    } catch (e) {
      console.error('Auth listener error:', e);
    }
  }
}

/**
 * Sign In with email and password
 * Validates against seeded accounts or created student accounts
 */
export async function signIn(email, password) {
  await new Promise(r => setTimeout(r, 300)); // realistic latency

  const normalizedEmail = email.trim().toLowerCase();
  
  // Check demo accounts
  const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
  if (demoAccount && demoAccount.password === password) {
    const sessionUser = { ...demoAccount };
    delete sessionUser.password;
    saveAuthUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  // Check custom created student accounts
  try {
    const customUsers = JSON.parse(localStorage.getItem('HERE_CUSTOM_USERS') || '[]');
    const match = customUsers.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
    if (match) {
      const sessionUser = { ...match };
      delete sessionUser.password;
      saveAuthUser(sessionUser);
      return { success: true, user: sessionUser };
    }
  } catch (e) {
    console.error(e);
  }

  return { success: false, error: 'Invalid university email or password. Use demo credentials below to test.' };
}

/**
 * Public Sign Up: Always creates a STUDENT account
 */
export async function signUp({ name, email, password, year = '1st Year', department = 'General Studies' }) {
  await new Promise(r => setTimeout(r, 400));

  const normalizedEmail = email.trim().toLowerCase();
  
  if (DEMO_ACCOUNTS[normalizedEmail]) {
    return { success: false, error: 'An account with this university email already exists.' };
  }

  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  const newStudent = {
    id: `STU-${Math.floor(10000 + Math.random() * 90000)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'STUDENT',
    department,
    year,
    avatarInitials: initials,
    avatarColor: '#F4B6D7',
    preferences: {
      modality: 'Confidential 1-on-1',
      shareSummaryWithAdvisor: true,
      allowUrgentHandoff: true
    }
  };

  try {
    const customUsers = JSON.parse(localStorage.getItem('HERE_CUSTOM_USERS') || '[]');
    customUsers.push(newStudent);
    localStorage.setItem('HERE_CUSTOM_USERS', JSON.stringify(customUsers));
  } catch (e) {
    console.error(e);
  }

  const sessionUser = { ...newStudent };
  delete sessionUser.password;
  saveAuthUser(sessionUser);

  return { success: true, user: sessionUser };
}

/**
 * Sign out and clear session
 */
export function signOut() {
  saveAuthUser(null);
}

/**
 * Simulated password reset link
 */
export async function sendPasswordReset(email) {
  await new Promise(r => setTimeout(r, 350));
  return {
    success: true,
    message: `Password reset instructions have been sent to ${email}. (Simulated for prototype)`
  };
}
