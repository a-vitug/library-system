const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create employee
router.post('/create-employee', async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const employee = new User({
      username,
      email,
      password: hashed,
      phone,
      role: 2
    });

    await employee.save();

    res.json({ message: "Employee created" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;