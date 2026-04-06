const path = require('path');
const express = require('express');
const router = express.Router();
const user = {
  username: "jdoe",
  password: "test"
};

// Home
router.get('/home', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'front-end/pages/home.html'));
});

// Login
router.get('/log-in', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'front-end/pages/authentication/log-in.html'));
});

router.post("/log-in", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    res.send("Login successful!");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Create account
router.get('/create-account', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'front-end/pages/authentication/create-account.html'));
});

// Genres
router.get('/genre/:name', (req, res) => {
  const filePath = path.join(process.cwd(), `front-end/pages/genres/${req.params.name}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Genre not found');
  });
});

module.exports = router;