const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 25,
    maxlength: 3000
    // 🟢 Removed the restrictive 'match' property so normal sentences with spaces and punctuation are accepted!
  },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);