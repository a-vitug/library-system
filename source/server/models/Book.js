const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  isbn: String,

  available: {
    type: Boolean,
    default: true
  },

  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  dueDate: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Book', bookSchema);