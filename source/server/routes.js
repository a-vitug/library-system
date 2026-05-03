const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('./models/User');

const PAGES_DIR = path.join(__dirname, '../../front-end/pages');

// Login
router.get('/log-in', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/authentication/log-in.html'));
});

router.post("/log-in", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await user.isCorrectPassword(password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ 
      message: "Login successful!", 
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create account
router.get('/create-account', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/authentication/create-account.html'));
});

router.post('/create-account', async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }, { phone }]
    });

    if (existingUser) {
      let errorType = 1;
      if (existingUser.email === email) errorType = 2;
      if (existingUser.phone === phone) errorType = 3;
      
      return res.redirect(`/create-account?error=${errorType}`);
    }

    await User.create({ name, username, email, phone, password });
    res.redirect('/log-in?signup=success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// User dashboard
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/dashboard.html'));
});

// Search page
router.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/search.html'), (err) => {
    if (err) {
      res.status(404).send('Search page not found');
    }
  });
});

// Member profile
router.get('/member-profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/portals/member.html'));
});

// Genres
router.get('/genre/:name', (req, res) => {
  const filePath = path.join(PAGES_DIR, `../../front-end/pages/genres/${req.params.name}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Genre not found');
  });
});

module.exports = router;