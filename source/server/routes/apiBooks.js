const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { requireAuth, requireRole } = require('../middleware/authMid');

router.get('/search', requireAuth, requireRole('librarian', 'manager'), async (req, res) => {
  try {
    const { isbn } = req.query;
    if (!isbn || !isbn.trim()) {
      return res.status(400).json({ error: 'ISBN is required' });
    }
    const book = await Book.findOne({ isbn: isbn.trim() }).populate('checkedOutBy', 'username email');
    if (!book) {
      return res.status(404).json({ error: 'Book not found in catalog' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add-from-api', requireAuth, async (req, res) => {
  try {
    const { title, authors, categories, isbn, thumbnail, description } = req.body;

    const book = await Book.findOneAndUpdate(
      { 
        isbn,
      },
      {
        title,
        authors: authors || [],
        genre: categories || [],
        thumbnail,
        description,
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );

    res.json(book);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;