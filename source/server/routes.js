const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('./models/User');

const PAGES_DIR = path.join(__dirname, '../../front-end/pages');

// Home
router.get('/home', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../../front-end/pages/home.html'));
});

// Login
router.get('/log-in', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../../front-end/pages/authentication/log-in.html'));
});

router.post("/log-in", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const validPassword = await user.isCorrectPassword(password);

    if (!validPassword) {
      return res.status(401).send("Invalid credentials");
    }

    res.send("Login successful!");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Create account
router.get('/create-account', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/authentication/create-account.html'));
});

// Genres
router.get('/genre/:name', (req, res) => {
  const filePath = path.join(PAGES_DIR, `../../front-end/pages/genres/${req.params.name}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Genre not found');
  });
});

module.exports = router;