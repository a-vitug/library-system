const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const { requireAuth, requireRole } = require('../middleware/authMid');
const bcrypt = require('bcrypt');

// Create employee
router.post('/create-employee', requireAuth, requireRole("manager"), async(req, res) => {
  const { name, username, email, password, phone, role } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const employee = new User({
      name,
      username,
      email,
      password,
      phone,
      role
    });

    await employee.save();

    return res.json({ message: "Employee created" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
router.get('/users/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('checkedOutBooks');

    if (!user) return res.status(404).send("User not found");

    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/users', requireAuth, requireRole("manager", "librarian"), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', requireAuth, requireRole("manager", "librarian"), async (req, res) => {
  try {
    const { name, username, email, password, phone, role } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashed,
      phone,
      role
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete('/users/:id', requireAuth, requireRole('manager'), async (req,res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).send("You cannot delete your own account");
  };

  await User.findByIdAndDelete(req.params.id);
  res.json({message:"User deleted."});
});

// Get all books
router.get('/all-books', requireAuth, requireRole("manager", "librarian"), async (req, res) => {
  const books = await Book.find().populate('checkedOutBy', 'name username');
  res.json(books);
});

// Get all user's books
router.get('/users/:id/books', requireAuth, requireRole("librarian", "manager"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('checkedOutBooks');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.checkedOutBooks);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/books/return', requireAuth, requireRole("librarian", "manager"), async (req, res) => {
  const { userId, bookId } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).send("Book not found");

  book.available = true;
  book.checkedOutBy = null;
  book.dueDate = null;
  await book.save();

  await User.findByIdAndUpdate(userId, {
    $pull: { checkedOutBooks: bookId }
  });

  res.json({ message: "Book returned" });
});

router.post('/books/renew', requireAuth, requireRole("librarian", "manager"), async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);

    if (!book) return res.status(404).send("Book not found");

    if (!book.dueDate) {
      return res.status(400).send("No due date to extend");
    }

    const newDue = new Date(book.dueDate);
    newDue.setDate(newDue.getDate() + 14); // extend 2 weeks
    book.dueDate = newDue;

    await book.save();

    res.json({ message: "Due date extended", dueDate: book.dueDate });

  } catch (err) {
    console.error(err);
    res.status(500).send("Renew failed");
  }
});

// Delete book
router.delete('/delete-book/:id', requireAuth, requireRole('manager'), async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});


module.exports = router;