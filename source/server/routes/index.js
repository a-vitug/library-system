const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const bookRoutes = require('./book');
const managerRoutes = require('./manager');
const pageRoutes = require('./pages');

router.use('/', authRoutes);
router.use('/books', bookRoutes);
router.use('/manager', managerRoutes);
router.use('/', pageRoutes);

module.exports = router;