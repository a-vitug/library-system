const express = require('express');
const { requireAuth } = require('../middleware/authMid');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');

// Checkout
router.post('/checkout/:id', requireAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Book not found");

    if (!book.available) {
      return res.status(400).send("Book already checked out");
    }

    const isStaff = req.user.role === 'manager' || req.user.role === 'librarian';

    const targetUserId = (isStaff && req.body.targetUserId)
      ? req.body.targetUserId
      : req.user.id;

    const user = await User.findById(targetUserId);
    if (!user) return res.status(404).send("User not found");

    book.available = false;
    book.checkedOutBy = targetUserId;

    const due = new Date();
    due.setDate(due.getDate() + 14);
    book.dueDate = due;

    if (!user.checkedOutBooks.some(id => id.toString() === book._id.toString())) {
      user.checkedOutBooks.push(book._id);
      await user.save();
    }

    await book.save();

    res.json({
      message: "Book checked out",
      dueDate: book.dueDate,
      user: user.username
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Return
router.post('/return/:id', requireAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).send("Book not found");

    const user = await User.findById(book.checkedOutBy);
    const isMember = book.checkedOutBy.toString() === req.user.id;
    const isStaff = req.user.role === 'manager' || req.user.role === 'librarian';

    if (book.available) {
      return res.status(400).send("Book is already available");
    }

    if (!isMember && !isStaff) {
      return res.status(403).send("Not allowed to return this book");
    }

    book.available = true;
    book.checkedOutBy = null;
    book.dueDate = null;

    if (user) {
      user.checkedOutBooks = user.checkedOutBooks.filter(
        id => id.toString() !== book._id.toString()
      );
      await user.save();
    }

    await book.save();

    res.json({ message: "Book returned" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;