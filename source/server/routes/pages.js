const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const jwt = require('jsonwebtoken');
const { requireAuth, requireRole } = require('../middleware/authMid');

const PAGES_DIR = path.join(__dirname, '../../../front-end/pages');

// Home
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
  res.sendFile(path.join(PAGES_DIR, 'librarian-portal.html'));
});

router.get('/member', requireAuth, requireRole('member'), (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'member-portal.html'));
});

// Genres
router.get('/genre/:name', (req, res) => {
  const filePath = path.join(PAGES_DIR, `../../front-end/pages/genres/${req.params.name}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Genre not found');
  });
});

module.exports = router;