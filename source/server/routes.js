const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');

router.use('/', authRoutes);
router.use('/', pageRoutes);

module.exports = router;