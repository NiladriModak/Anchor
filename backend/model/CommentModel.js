const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    default: "",
  },
  commentText: {
    type: String,
    required: true,
    default: "",
  },
  author: {
    type: String,
    required: true,
    default: "",
  },
  sentiment: {
    type: String,
    default: "Neutral",
  },
  publishedAt: {
    type: Date,
    default: "",
  },
});

module.exports = new mongoose.model("Comment", commentSchema);
