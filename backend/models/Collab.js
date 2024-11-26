const mongoose = require("mongoose");

const collabSchema = new mongoose.Schema({
  brand1: {
    type: String,
    required: true,
  },
  brand2: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Collab", collabSchema);
