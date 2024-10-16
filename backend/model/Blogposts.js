const mongoose = require("mongoose");
const Tags = require("./Tags");
const User = require("./User");

const blogPostsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    body: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Tags,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Blogposts", blogPostsSchema);
