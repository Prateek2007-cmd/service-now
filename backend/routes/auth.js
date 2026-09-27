// Auth Routes for HERE Platform
import express from 'express';
import { findOne, insert } from '../../database/db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = findOne('users', u => u.email.toLowerCase() === cleanEmail);

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({
      error: 'Invalid Credentials',
      message: 'Email or password does not match registered university records.'
    });
  }

  // Return clean user object (never expose passwordHash)
  const safeUser = { ...user };
  delete safeUser.passwordHash;

  return res.json({
    user: safeUser,
    token: `here_token_${user.id}_${Date.now()}`
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const email = req.headers['x-user-email'] || 'student@here.demo';
  const user = findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return res.json({ user: safeUser });
  }
  return res.status(404).json({ error: 'User not found' });
});

export default router;
