const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  authors: [String],
  genre: [String],
  isbn: {
    type: String,
    sparse: true,
  },
  thumbnail: String,
  description: String,
  favoriteCount: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  dueDate: {
    type: Date,
    default: null,
    index: true
  },
  price: {
    type: Number,
    default: 0
  }
});

bookSchema.virtual('isOverdue').get(function () {
  return this.dueDate && this.dueDate < new Date();
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

bookSchema.pre('save', function () {
  if (this.genre) {
    this.genre = this.genre.map(g => g.toLowerCase());
  }
});

module.exports = mongoose.model('Book', bookSchema);