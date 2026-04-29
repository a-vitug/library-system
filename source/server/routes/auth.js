const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const jwt = require('jsonwebtoken');
const { requireAuth, requireRole } = require('../middleware/authMid');

const PAGES_DIR = path.join(__dirname, '../../../front-end/pages');

// Login
router.get('/log-in', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'authentication/log-in.html'));
});

router.post('/log-in', async (req, res) => {
  const { username, password, role: selectedRole } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(401).send("Invalid credentials");

    const valid = await user.isCorrectPassword(password);
    if (!valid) return res.status(401).send("Invalid credentials");

    if (user.role !== selectedRole) return res.status(403).json({ error: `This account is a ${ user.role } and does not have authority to access ${ selectedRole } page`});

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h"}
    );

    return res.json({ token, role: user.role });

  } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
  }
});

// Create Account
router.get('/create-account', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'authentication/create-account.html'));
});

router.post('/create-account', async (req, res) => {
  const { name, username, email, password, phone, role } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("User already exists");

    const user = new User({
      name,
      username,
      email,
      password,
      phone,
      role
    });

    await user.save();

    res.redirect('/log-in?signup=success');

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;