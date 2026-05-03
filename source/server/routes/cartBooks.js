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

    book.available = false;
    book.checkedOutBy = req.user.id;

    // due in 14 days
    const due = new Date();
    due.setDate(due.getDate() + 14);
    book.dueDate = due;

    await book.save();

    res.json({ message: "Book checked out", dueDate: book.dueDate });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Return
router.post('/return/:id', requireAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!book) return res.status(404).send("Book not found");

    if (book.available) {
      return res.status(400).send("Book is already available");
    }

    if (book.checkedOutBy.toString() !== req.user.id) {
      return res.status(403).send("Returned book");
    }

    book.available = true;
    book.checkedOutBy = null;
    book.dueDate = null;

    user.checkedOutBooks = user.checkedOutBooks.filter(
      id => id.toString() !== book._id.toString()
    );

    await book.save();    
    await user.save();

    res.json({ message: "Book returned" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;