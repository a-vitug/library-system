const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth');

router.use('/', authRoutes);

module.exports = router;