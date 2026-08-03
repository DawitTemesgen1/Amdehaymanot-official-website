const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }
  return new OAuth2Client(clientId);
};

const toPublicUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

/**
 * Google Sign-In / Sign-Up (only auth method).
 * Accepts a Google ID token from the client, verifies it, then
 * finds or creates the user and returns our app JWT.
 */
exports.googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    if (payload.email_verified === false) {
      return res.status(401).json({ message: 'Google email is not verified' });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const name = payload.name || email.split('@')[0];
    const avatarUrl = payload.picture || null;

    let user = await User.findByGoogleId(googleId);

    if (!user) {
      user = await User.findByEmail(email);
      if (user) {
        // Link existing email account (e.g. previous password users / admins)
        await User.linkGoogleAccount(user.id, {
          google_id: googleId,
          name,
          avatar_url: avatarUrl,
        });
        user = await User.findById(user.id);
      } else {
        const created = await User.create({
          name,
          email,
          password: null,
          google_id: googleId,
          avatar_url: avatarUrl,
        });
        user = await User.findById(created.id);
      }
    } else {
      await User.updateProfileFromGoogle(user.id, { name, avatar_url: avatarUrl });
      user = await User.findById(user.id);
    }

    res.json({
      token: generateToken(user.id),
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    if (error.message === 'GOOGLE_CLIENT_ID is not configured') {
      return res.status(500).json({ message: 'Google sign-in is not configured on the server' });
    }
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

exports.registerUser = (_req, res) => {
  res.status(410).json({
    message: 'Email/password registration is disabled. Please use Google sign-in.',
  });
};

exports.loginUser = (_req, res) => {
  res.status(410).json({
    message: 'Email/password login is disabled. Please use Google sign-in.',
  });
};

exports.getMe = (req, res) => res.status(200).json(req.user);

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.promoteUser = async (req, res) => {
  const { role } = req.body;
  try {
    await User.updateRole(parseInt(req.params.id, 10), role);
    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
