const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['manager', 'librarian', 'member'],
      default: 'member',
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must match a valid email address!'],
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    interestGenres: [String],
    interestAuthors: [String],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      }
    ],
    checkedOutBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      }
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.set('toObject', { virtuals: true });

userSchema.virtual('checkedOutCount').get(function () {
  return this.checkedOutBooks ? this.checkedOutBooks.length : 0;
});

userSchema.virtual('hasOverdueBooks').get(function () {
  if (!this.checkedOutBooks) return false;

  return this.checkedOutBooks.some(book =>
    book.dueDate && book.dueDate < new Date()
  );
});

userSchema.pre('save', function () {
  if (this.interestGenres) {
    this.interestGenres = this.interestGenres.map(g => g.toLowerCase());
  }
});

userSchema.methods.addFavorite = function (bookId) {
  if (!this.favorites.includes(bookId)) {
    this.favorites.push(bookId);
  }
};

userSchema.methods.addCheckedOutBook = function (bookId) {
  if (!this.checkedOutBooks.includes(bookId)) {
    this.checkedOutBooks.push(bookId);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;