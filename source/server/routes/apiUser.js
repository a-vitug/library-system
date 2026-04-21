const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const { requireAuth } = require('../middleware/authMid');

// Add to favorites
router.post('/favorites/:bookId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.bookId)) {
      user.favorites.push(req.params.bookId);
      await user.save();
    }

    res.json({ message: "Added to favorites" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Remove from favorites
router.delete('/favorites/:bookId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.bookId
    );

    await user.save();

    res.json({ message: "Removed from favorites" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Get favorite books
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites');

    res.json(user.favorites);

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Get checked out books
router.get('/my-books', requireAuth, async (req, res) => {
  try {
    const books = await Book.find({
      checkedOutBy: req.user.id
    });

    res.json(books);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;