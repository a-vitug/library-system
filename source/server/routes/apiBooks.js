const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { requireAuth, requireRole } = require('../middleware/authMid');

router.post('/add-from-api', requireAuth, async (req, res) => {
  try {
    const { title, authors, categories, isbn } = req.body;

    const book = await Book.findOneAndUpdate(
      { 
        isbn,
      },
      {
        title,
        author: authors?.join(', '),
        genre: categories || []
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );

    await book.save();

    res.json(book);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;