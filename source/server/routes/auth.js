const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../../../front-end/pages');

// Home
router.get('/home', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../../front-end/pages/home.html'));
});

// Login
router.get('/log-in', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'authentication/log-in.html'));
});

router.post('/log-in', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const valid = await user.isCorrectPassword(password);

    if (!valid) {
      return res.status(401).send("Invalid credentials");
    }

    if (role && role !== user.role) {
      return res.status(403).send("Wrong role selected");
    }

    return res.redirect('/home');

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
  const { username, email, password, phone, role } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
      phone,
      role
    });

    await user.save();

    res.json({ message: "User created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Genres
router.get('/genre/:name', (req, res) => {
  const filePath = path.join(PAGES_DIR, `../../front-end/pages/genres/${req.params.name}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Genre not found');
  });
});

module.exports = router;