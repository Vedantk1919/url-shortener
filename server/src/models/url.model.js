const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
    unique: true
  },
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  clicks: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qrCode: {
    type: String,
    default: null
  }
});

module.exports = {
  URLModel: mongoose.model('URL', urlSchema)
};