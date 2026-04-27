const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/authMid');
const bcrypt = require('bcrypt');

// Create employee
router.post('/create-employee', async (req, res) => {
  const { name, username, email, password, phone, role } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("User already exists");

    const employee = new User({
      name,
      username,
      email,
      password: hashed,
      phone,
      role: "employee"
    });

    await employee.save();

    return res.json({ message: "Employee created" });

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

// Delete a user
router.delete('/api/users/:id', requireAuth, requireRole('manager'), async (req,res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({message:"User deleted."});
});

// Get all books
router.get('/all-books', requireAuth, requireRole('manager'), async (req, res) => {
  const books = await Book.find().populate('checkedOutBy', 'name username');
  res.json(books);
});

// Delete book
router.delete('/delete-book/:id', requireAuth, requireRole('manager'), async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

module.exports = router;