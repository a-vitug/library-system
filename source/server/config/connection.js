const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI || 'mongodb+srv://noteful-app:notefulclone123@noteful-app.fthcj.mongodb.net/test'
).catch(err => {
  console.error('MongoDB connection failed:', err.message);
});

module.exports = mongoose.connection;