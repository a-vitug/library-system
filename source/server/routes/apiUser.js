const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const { requireAuth } = require('../middleware/authMid');

// Get user data
router.get('/me', requireAuth, async(req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');

  res.json(user);
});

// Add to favorites
router.post('/favorites/:bookId', requireAuth, async(req, res) => {
  try {

    const user = await User.findById(req.user.id);
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    };

    if (!user.favorites.includes(book._id)) {
      user.favorites.push(book._id);
    };

    if (book.genre) {
      book.genre.forEach(g => {
        if (!user.interestGenres.includes(g)) {
          user.interestGenres.push(g);
        };
      });
    };

    if (book.author && !user.interestAuthors.includes(book.author)) {
      user.interestAuthors.push(book.author);
    };

    await user.save();

    res.json({message:"Added to favorites"});

  } catch(err) {
    res.status(500).send(err.message);
  };

});


// Remove from favorites
router.delete('/favorites/:bookId', requireAuth, async(req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.bookId);

    await user.save();

    res.json({ message: "Removed from favorites" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Get favorite books
router.get('/favorites', requireAuth, async(req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    const genres = user.favorites.flatMap(book => book.genre);

    const topGenre = mostCommon(genres);

    const recs = await Book.find({
      genre: topGenre,
      _id:{
        $nin:user.favorites
      }
    }).limit(8);

    res.json(user.favorites);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/favorites/count', requireAuth, async(req, res) => {
  const user = await User.findById(req.user.id);

  res.json({ count:user.favorites.length });
});


// Get checked out books
router.get('/my-books', requireAuth, async(req, res) => {
  try {
    const books = await Book.find({
      checkedOutBy: req.user.id
    });

    res.json(books);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Recommendations
router.get('/recommendations', requireAuth, async(req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    if(!user.favorites.length) {
      return res.json([]);
    };

    const genres = {};

    user.favorites.forEach(book => {(book.genre || []).forEach(g => {
      genres[g] = (genres[g] || 0) + 1;
    })});

    const topGenre = Object.keys(genres).sort((a, b) => genres[b] - genres[a])[0];

    const favoritesId = user.favorites.map(b => b._id);

    let recs = await Book.find({
      genre: topGenre,
      _id: {$nin: favoritesId }
    }).limit(6);

    res.json(recs);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;