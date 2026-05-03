const express = require('express');
const router = express.Router();
const axios = require('axios');
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
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    if (!user || !user.favorites.length) {
      return res.json([]);
    }

    const favoriteTitles = new Set(
      user.favorites.map(b => (b.title || "").toLowerCase())
    );

    const genreScore = {};

    user.favorites.forEach((book, index) => {
      const genres = book.genre || book.categories || [];

      const weight = index + 1;

      genres.forEach(g => {
        const key = g.toLowerCase();
        genreScore[key] = (genreScore[key] || 0) + weight;
      });
    });

    const topGenres = Object.entries(genreScore)
      .sort((a, b) => b[1] - a[1])
      .map(g => g[0])
      .slice(0, 3);

    let results = [];

    for (let genre of topGenres) {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: `subject:${genre}`,
          maxResults: 5
        }
      });

      const items = response.data.items || [];

      const mapped = items.map(item => ({
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        genre: item.volumeInfo.categories || []
      }));

      results = results.concat(mapped);
    }

    const trendingRes = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: 'bestseller',
        maxResults: 5
      }
    });

    const trending = (trendingRes.data.items || []).map(item => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      genre: item.volumeInfo.categories || []
    }));

    results = results.concat(trending);

    results = results.filter(book =>
      !favoriteTitles.has((book.title || "").toLowerCase())
    );

    results = results.sort(() => 0.5 - Math.random());

    res.json(results.slice(0, 12));

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating recommendations");
  }
});

module.exports = router;