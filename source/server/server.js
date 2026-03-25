const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../../front-end/static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/templates/webpage.html'));
});

const user = {
  username: "jdoe",
  password: "test"
};

app.get('/log-in', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/templates/log-in.html'));
});

app.post("/log-in", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    res.send("Login successful!");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});