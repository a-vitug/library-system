const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: [String],
  isbn: {
    type: String,
    unique: true,
  },
  thumbnail: String,
  description: String,

  favoriteCount: {
    type:Number,
    default:0
  },

  available: {
    type:Boolean,
    default:true
  },

  checkedOutBy: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    default:null
  },

  dueDate: {
    type:Date,
    default:null
  },

  price: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Book', bookSchema);