const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { requireAuth, requireRole } = require('../middleware/authMid');

router.post('/add-from-api', requireAuth, requireRole('manager'), async (req, res) => {
  try {
    const { title, authors, isbn } = req.body;

    const book = new Book({
      title,
      author: authors?.join(', '),
      isbn: isbn
    });

    await book.save();

    res.json(book);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;