const express = require("express");
const routes = require('./routes');
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const axios = require("axios");
const db = require("./config/connection");

require('dotenv').config();

const app = express();
const PORT = 3000;

const authRoute = require('./routes/auth');
const bookRoute = require('./routes/book');
const managerRoute = require('./routes/manager');

db.once("open", () => {
  console.error("MongoDB connection");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoute);
app.use('/books', bookRoute);
app.use('/manager', managerRoute);
app.use(express.static(path.join(__dirname, '../../front-end')));
app.use('/pages', express.static(path.join(__dirname, '../../front-end/pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/pages/home.html'));
});

const user = {
  username: "jdoe",
  password: "test"
};

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/google-books/search', async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const maxResultsRaw = (req.query.maxResults || "10").toString();
    const startIndexRaw = (req.query.startIndex || "0").toString();

    if (!q) {
      return res.status(400).json({ error: "Missing required query param: q" });
    }

    const maxResults = Math.max(1, Math.min(40, parseInt(maxResultsRaw, 10) || 10));
    const startIndex = Math.max(0, parseInt(startIndexRaw, 10) || 0);

    const params = {
      q,
      maxResults,
      startIndex,
    };

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (apiKey) {
      params.key = apiKey;
    }

    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', { params });
    const data = response.data || {};
    const items = Array.isArray(data.items) ? data.items : [];

    const results = items.map((item) => {
      const volumeInfo = item.volumeInfo || {};
      const imageLinks = volumeInfo.imageLinks || {};
      const industryIdentifiers = Array.isArray(volumeInfo.industryIdentifiers)
        ? volumeInfo.industryIdentifiers
        : [];

      const isbn10 = industryIdentifiers.find((x) => x && x.type === 'ISBN_10')?.identifier || null;
      const isbn13 = industryIdentifiers.find((x) => x && x.type === 'ISBN_13')?.identifier || null;

      return {
        googleId: item.id || null,
        title: volumeInfo.title || null,
        subtitle: volumeInfo.subtitle || null,
        authors: Array.isArray(volumeInfo.authors) ? volumeInfo.authors : [],
        publisher: volumeInfo.publisher || null,
        publishedDate: volumeInfo.publishedDate || null,
        description: volumeInfo.description || null,
        pageCount: typeof volumeInfo.pageCount === 'number' ? volumeInfo.pageCount : null,
        categories: Array.isArray(volumeInfo.categories) ? volumeInfo.categories : [],
        language: volumeInfo.language || null,
        isbn10,
        isbn13,
        thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || null,
        previewLink: volumeInfo.previewLink || null,
        infoLink: volumeInfo.infoLink || null,
      };
    });

    return res.json({
      totalItems: typeof data.totalItems === 'number' ? data.totalItems : results.length,
      results,
    });
  } catch (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.error?.message || err.message || "Unknown error";
    return res.status(status && Number.isInteger(status) ? status : 500).json({ error: message });
  }
});
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
