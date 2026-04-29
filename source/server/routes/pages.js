const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { requireAuth, requireRole } = require('../middleware/authMid');

const PAGES_DIR = path.join(__dirname, '../../../front-end/pages');

// Home
router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../../front-end/pages/home.html'));
});

// Home for logged in users
router.get('/user', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      id: user._id,
      role: user.role,
      name: user.name
    });

  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Role check
router.get('/admin', requireAuth, requireRole('manager'), (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'manager-portal.html'));
});

router.get('/librarian', requireAuth, requireRole('employee'), (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'portals/librarian/librarian.html'));
});

router.get('/member', requireAuth, requireRole('member'), (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'member.html'));
});

// Genres
router.get('/genres', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'genres/genres.html'));
});

module.exports = router;